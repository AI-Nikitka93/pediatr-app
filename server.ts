import "dotenv/config";
import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import { GoogleGenAI } from "@google/genai";
import { PrismaClient } from "@prisma/client";
import { randomBytes, createHash, createCipheriv, createDecipheriv } from "crypto";
import jwt from "jsonwebtoken";
import { detectPediatricCareRoute, PEDIATRIC_CARE_ROUTE_RULES } from "./src/clinicalRouter.js";

let prisma: PrismaClient;

function getPrisma() {
  if (!prisma) {
    if (!process.env.DATABASE_URL) throw new Error("DATABASE_URL is missing!");
    prisma = new PrismaClient();
  }
  return prisma;
}

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export { detectEmergencyTriage, detectPediatricCareRoute, PEDIATRIC_CARE_ROUTE_RULES } from "./src/clinicalRouter.js";

export const MAX_CHAT_MESSAGES = 20;
export const MAX_MESSAGE_CHARS = 5000;

export const PEDIATRIC_SYSTEM_INSTRUCTION =
  "Вы — опытный, чуткий и заботливый детский врач-педиатр Анна Сергеевна, сторонник доказательной медицины. " +
  "Вы вежливо и доходчиво отвечаете на вопросы родителей о детском здоровье на русском языке. " +
  "Ваш тон — теплый, профессиональный и успокаивающий. " +
  "Вы помогаете родителям структурировать симптомы, понять красные флаги, подготовиться к визиту и выбрать безопасный следующий шаг. " +
  "Вы можете объяснять общие принципы ухода, питания, гигиены, вакцинации и мягкого симптоматического ухода, " +
  "но никогда не назначаете антибиотики, дозировки, рецептурные препараты или серьезное лечение без очного визита. " +
  "Если вопрос содержит признаки угрозы жизни или быстро ухудшающегося состояния, первым делом рекомендуйте срочно обратиться за экстренной помощью. " +
  "ВАЖНО: В каждом ответе вежливо напомните, что советы носят информационный характер и не заменяют очную консультацию квалифицированного врача-педиатра. " +
  "При угрожающих симптомах, включая одышку, судороги, синюшность губ, выраженную вялость, признаки обезвоживания, неукротимую рвоту или высокую несбиваемую температуру, необходимо немедленно вызвать скорую помощь.";

const SAFE_FALLBACK_REPLY =
  "Здравствуйте. Сейчас ИИ-сервис не настроен на сервере, поэтому я не буду имитировать полноценную консультацию. " +
  "Безопасный общий ориентир: наблюдайте за самочувствием ребенка, поддерживайте питье и прохладный влажный воздух, " +
  "а при одышке, судорогах, выраженной вялости, синюшности губ, признаках обезвоживания, неукротимой рвоте или высокой несбиваемой температуре немедленно вызовите скорую помощь. " +
  "Эта информация не заменяет очную консультацию врача-педиатра.";

function hashPassword(password: string) {
  return createHash("sha256").update(password + process.env.SALT).digest("hex");
}

const ENCRYPTION_KEY = Buffer.from(process.env.SALT || "default-salt-1234567890123456789").toString("utf8").padEnd(32, "0").substring(0, 32);

function encryptData(text: string) {
  const iv = randomBytes(12);
  const cipher = createCipheriv("aes-256-gcm", Buffer.from(ENCRYPTION_KEY), iv);
  let encrypted = cipher.update(text, "utf8", "hex");
  encrypted += cipher.final("hex");
  const authTag = cipher.getAuthTag().toString("hex");
  return { iv: iv.toString("hex"), encrypted, authTag };
}

function decryptData(encData: { iv: string, encrypted: string, authTag: string }) {
  const decipher = createDecipheriv("aes-256-gcm", Buffer.from(ENCRYPTION_KEY), Buffer.from(encData.iv, "hex"));
  decipher.setAuthTag(Buffer.from(encData.authTag, "hex"));
  let decrypted = decipher.update(encData.encrypted, "hex", "utf8");
  decrypted += decipher.final("utf8");
  return decrypted;
}

function generateToken(userId: string) {
  return jwt.sign({ userId }, process.env.JWT_SECRET || "secret", { expiresIn: "1d" });
}

export function createApp() {
  const app = express();
  const apiKey = process.env.GEMINI_API_KEY ?? "";
  const ai = apiKey ? new GoogleGenAI({ apiKey, httpOptions: { headers: { "User-Agent": "aistudio-build" } } }) : null;

  app.disable("x-powered-by");
  app.use((req, res, next) => {
    res.setHeader("X-Content-Type-Options", "nosniff");
    res.setHeader("X-Frame-Options", "DENY");
    res.setHeader("Referrer-Policy", "no-referrer");
    res.setHeader("Permissions-Policy", "camera=(), microphone=(), geolocation=()");
    if (req.path.startsWith("/api/")) res.setHeader("Cache-Control", "no-store");
    next();
  });

  app.use(express.json({ limit: "64kb" }));

  // --- Auth Middleware ---
  const requireAuth = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    const authHeader = req.headers.authorization;
    if (!authHeader?.startsWith("Bearer ")) return res.status(401).json({ error: "Unauthorized" });
    const token = authHeader.substring(7);
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET || "secret") as { userId: string };
      (req as any).user = await getPrisma().user.findUnique({ where: { id: decoded.userId } });
      if (!(req as any).user) return res.status(401).json({ error: "User not found" });
      next();
    } catch (e) {
      return res.status(401).json({ error: "Session expired or invalid" });
    }
  };

  // --- API Routes ---
  app.post("/api/auth/register", async (req, res) => {
    try {
      const { email, password, name, type } = req.body;
      const existing = await getPrisma().user.findUnique({ where: { email } });
      if (existing) return res.status(400).json({ error: "Email already exists" });
      const user = await getPrisma().user.create({
        data: { email, passwordHash: hashPassword(password), name, type: type || "private" }
      });
      res.status(201).json({ success: true, user: { id: user.id, email: user.email, name: user.name, type: user.type } });
    } catch (e) { res.status(500).json({ error: "Registration failed" }); }
  });

  app.post("/api/auth/login", async (req, res) => {
    try {
      const { email, password } = req.body;
      const user = await getPrisma().user.findUnique({ where: { email } });
      if (!user || user.passwordHash !== hashPassword(password)) {
        return res.status(401).json({ error: "Invalid credentials" });
      }
      const token = generateToken(user.id);
      res.json({ token, user: { id: user.id, email: user.email, name: user.name, type: user.type } });
    } catch (e: any) { 
      res.status(500).json({ error: "Demo session failed", details: e?.message || String(e) }); 
    }
  });

  app.get("/api/auth/debug-env", (req, res) => {
    res.json({
      hasDbUrl: !!process.env.DATABASE_URL,
      dbUrlLength: process.env.DATABASE_URL?.length || 0,
      hasDirectUrl: !!process.env.DIRECT_URL,
      hasSalt: !!process.env.SALT
    });
  });

  app.post("/api/auth/demo-session", async (req, res) => {
    try {
      const { user } = req.body;
      let dbUser = await getPrisma().user.findUnique({ where: { email: user.email } });
      if (!dbUser) {
        dbUser = await getPrisma().user.create({
          data: {
            email: user.email,
            passwordHash: hashPassword("12345"),
            name: user.name || "Demo User",
            type: user.type || "PARENT"
          }
        });
      }
      const token = generateToken(dbUser.id);
      res.json({
        sessionId: token,
        expiresAt: new Date(Date.now() + 24 * 3600 * 1000).toISOString(),
        auditId: "demo-audit-" + Date.now(),
        consent: true
      });
    } catch (e: any) {
      console.error("DEMO SESSION ERROR", e);
      res.status(500).json({ error: "Demo session failed", details: e?.message || String(e) });
    }
  });

  app.get("/api/auth/me", requireAuth, (req, res) => {
    res.json({ user: (req as any).user });
  });

  app.get("/api/child-profile", requireAuth, async (req, res) => {
    const user = (req as any).user;
    const profile = await getPrisma().childProfile.findFirst({ where: { parentId: user.id } });
    if (!profile) return res.status(404).json({ error: "No profile found" });
    try {
      const decryptedName = decryptData(JSON.parse(profile.name));
      res.json({ profile: { ...profile, name: decryptedName } });
    } catch {
      res.json({ profile }); // Fallback for old unencrypted data
    }
  });

  app.put("/api/child-profile", requireAuth, async (req, res) => {
    const user = (req as any).user;
    const { name, gender, birthdate } = req.body.profile;
    const encryptedName = JSON.stringify(encryptData(name));
    const existing = await getPrisma().childProfile.findFirst({ where: { parentId: user.id } });
    let profile;
    if (existing) {
      profile = await getPrisma().childProfile.update({
        where: { id: existing.id },
        data: { name: encryptedName, gender, birthdate: new Date(birthdate) }
      });
    } else {
      profile = await getPrisma().childProfile.create({
        data: { name: encryptedName, gender, birthdate: new Date(birthdate), parentId: user.id }
      });
    }
    res.json({ profile: { ...profile, name } });
  });

  app.post("/api/chat", async (req, res) => {
    try {
      const messages = req.body?.messages;
      if (!messages || !Array.isArray(messages)) return res.status(400).json({ error: "Invalid messages array" });
      
      const lastUserMessage = [...messages].reverse().find(m => m.role === "user")?.parts?.[0]?.text;
      const careRoute = lastUserMessage ? detectPediatricCareRoute(lastUserMessage) : null;
      if (careRoute) {
        return res.json({ reply: careRoute.reply, isCareRoute: true, careRoute });
      }

      if (!apiKey || !ai) {
        return res.json({ reply: SAFE_FALLBACK_REPLY, isFallback: true });
      }

      // @ts-ignore
      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: messages,
        config: { systemInstruction: PEDIATRIC_SYSTEM_INSTRUCTION, temperature: 0.3 }
      });

      res.json({ reply: response.text || "Извините, сейчас я не могу ответить. Обратитесь к врачу." });
    } catch (e: any) {
      console.error(e);
      res.status(500).json({ error: "Server error", details: e.message });
    }
  });

  return app;
}

export async function startServer() {
  const app = createApp();
  const PORT = Number(process.env.PORT ?? 3000);

  if (process.env.NODE_ENV !== "production") {
    const { createServer: createViteServer } = await import("vite");
    const vite = await createViteServer({ server: { middlewareMode: true }, appType: "spa" });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`[Педиатр-Сервер] Запущен на http://localhost:${PORT}`);
  });
}

import { pathToFileURL } from "url";
const isCliEntry = process.argv[1] ? import.meta.url === pathToFileURL(process.argv[1]).href : false;
if (isCliEntry) {
  startServer();
}
