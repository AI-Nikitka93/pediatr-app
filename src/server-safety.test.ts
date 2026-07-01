import test from "node:test";
import assert from "node:assert/strict";
import { mkdtemp, readFile, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";

import {
  buildGenerateContentRequest,
  createApp,
  createFileBackedSecurityStore,
  createInMemorySecurityStore,
  detectEmergencyTriage,
  detectPediatricCareRoute,
  normalizeChatMessages,
  PEDIATRIC_SYSTEM_INSTRUCTION,
} from "../server";

async function closeServer(server: ReturnType<ReturnType<typeof createApp>["listen"]>) {
  await new Promise<void>((resolve, reject) => {
    server.close((error) => (error ? reject(error) : resolve()));
  });
}

function getServerPort(server: ReturnType<ReturnType<typeof createApp>["listen"]>) {
  const address = server.address();
  assert.equal(typeof address, "object");
  if (!address || typeof address !== "object") throw new Error("No test server port");
  return address.port;
}

async function createDemoSession(port: number, user = {
  id: "u_b2c_demo",
  email: "parent@example.com",
  type: "private",
  name: "Елена Иванова",
}) {
  const response = await fetch(`http://127.0.0.1:${port}/api/auth/demo-session`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({
      consentAccepted: true,
      user,
    }),
  });

  assert.equal(response.status, 201);
  return response.json() as Promise<{ sessionId: string }>;
}

async function saveChildProfile(port: number, sessionId: string, profile = {
  name: "Максим",
  gender: "boy",
  birthdate: "2025-05-15",
}) {
  const response = await fetch(`http://127.0.0.1:${port}/api/child-profile`, {
    method: "PUT",
    headers: {
      "content-type": "application/json",
      authorization: `Bearer ${sessionId}`,
    },
    body: JSON.stringify({
      consentAccepted: true,
      profile,
    }),
  });

  assert.equal(response.status, 200);
  return response.json();
}

test("normalizeChatMessages rejects missing message arrays", () => {
  const result = normalizeChatMessages(undefined);

  assert.equal(result.ok, false);
  assert.equal(result.status, 400);
});

test("normalizeChatMessages maps only supported chat roles into Gemini contents", () => {
  const result = normalizeChatMessages([
    { role: "user", text: "  Температура 38.2, ребенок пьет воду  " },
    { role: "assistant", text: "Наблюдайте за самочувствием." },
  ]);

  assert.equal(result.ok, true);
  assert.deepEqual(result.contents, [
    { role: "user", parts: [{ text: "Температура 38.2, ребенок пьет воду" }] },
    { role: "model", parts: [{ text: "Наблюдайте за самочувствием." }] },
  ]);
});

test("normalizeChatMessages rejects messages that are too long for safe pediatric triage", () => {
  const result = normalizeChatMessages([{ role: "user", text: "x".repeat(5001) }]);

  assert.equal(result.ok, false);
  assert.equal(result.status, 413);
});

test("buildGenerateContentRequest keeps medical chat conservative and escalation-aware", () => {
  const normalized = normalizeChatMessages([{ role: "user", text: "У ребенка одышка" }]);
  assert.equal(normalized.ok, true);
  if (!normalized.ok) return;

  const request = buildGenerateContentRequest(normalized.contents);

  assert.equal(request.model, "gemini-3-flash-preview");
  assert.equal(request.config.temperature, 0.3);
  assert.match(request.config.systemInstruction, /не заменяют очную консультацию/i);
  assert.match(request.config.systemInstruction, /немедленно вызвать скорую помощь/i);
  assert.match(PEDIATRIC_SYSTEM_INSTRUCTION, /никогда не назначаете антибиотики/i);
});

test("detectEmergencyTriage flags pediatric emergency warning signs before model calls", () => {
  const triage = detectEmergencyTriage("Ребенок тяжело дышит, губы синеют, не мочился уже 8 часов");

  assert.equal(triage.level, "emergency");
  assert.ok(triage.matchedSignals.includes("breathing_distress"));
  assert.ok(triage.matchedSignals.includes("blue_lips_or_skin"));
  assert.ok(triage.matchedSignals.includes("dehydration"));
  assert.match(triage.reply, /103|112/);
  assert.match(triage.reply, /не ждите ответа ИИ/i);
});

test("createApp returns deterministic emergency triage and skips the AI model for red flags", async () => {
  let calledModel = false;
  const app = createApp({
    apiKey: "test-key",
    aiClient: {
      models: {
        generateContent: async () => {
          calledModel = true;
          return { text: "model should not answer emergencies first" };
        },
      },
    },
  });
  const server = app.listen(0);

  try {
    const port = getServerPort(server);
    const response = await fetch(`http://127.0.0.1:${port}/api/chat`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        messages: [{ role: "user", text: "У ребенка судороги и губы стали синие" }],
      }),
    });
    const body = await response.json();

    assert.equal(response.status, 200);
    assert.equal(calledModel, false);
    assert.equal(body.isEmergencyTriage, true);
    assert.equal(body.emergencyTriage.level, "emergency");
    assert.match(body.reply, /103|112/);
  } finally {
    await closeServer(server);
  }
});

test("detectPediatricCareRoute sends fever in infants under 3 months to same-day pediatric care", () => {
  const route = detectPediatricCareRoute("Малышу 2 месяца, температура 38.1, сопли, пока дышит нормально");

  assert.equal(route.level, "urgent_same_day");
  assert.equal(route.ageMonths, 2);
  assert.ok(route.matchedSignals.includes("infant_under_3_months_fever"));
  assert.match(route.reply, /свяжитесь с педиатром/i);
  assert.doesNotMatch(route.reply, /103|112/);
});

test("createApp returns deterministic same-day route for infant fever and skips the AI model", async () => {
  let calledModel = false;
  const app = createApp({
    apiKey: "test-key",
    aiClient: {
      models: {
        generateContent: async () => {
          calledModel = true;
          return { text: "model should not handle infant fever first" };
        },
      },
    },
  });
  const server = app.listen(0);

  try {
    const port = getServerPort(server);
    const response = await fetch(`http://127.0.0.1:${port}/api/chat`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        messages: [{ role: "user", text: "Ребенку 8 недель, температура 38.2, что делать?" }],
      }),
    });
    const body = await response.json();

    assert.equal(response.status, 200);
    assert.equal(calledModel, false);
    assert.equal(body.isCareRoute, true);
    assert.equal(body.careRoute.level, "urgent_same_day");
    assert.equal(body.careRoute.ageMonths, 2);
    assert.match(body.reply, /свяжитесь с педиатром/i);
  } finally {
    await closeServer(server);
  }
});

test("createApp returns a safe fallback when Gemini key is not configured", async () => {
  const app = createApp({ apiKey: "" });
  const server = app.listen(0);

  try {
    const address = server.address();
    assert.equal(typeof address, "object");
    if (!address || typeof address !== "object") throw new Error("No test server port");

    const response = await fetch(`http://127.0.0.1:${address.port}/api/chat`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ messages: [{ role: "user", text: "кашель" }] }),
    });
    const body = await response.json();

    assert.equal(response.status, 200);
    assert.equal(body.isFallback, true);
    assert.match(body.reply, /не заменяет очную консультацию/i);
    assert.match(body.reply, /скорую помощь/i);
  } finally {
    await new Promise<void>((resolve, reject) => {
      server.close((error) => (error ? reject(error) : resolve()));
    });
  }
});

test("createApp rejects malformed chat payloads before model calls", async () => {
  let calledModel = false;
  const app = createApp({
    apiKey: "test-key",
    aiClient: {
      models: {
        generateContent: async () => {
          calledModel = true;
          return { text: "should not be called" };
        },
      },
    },
  });
  const server = app.listen(0);

  try {
    const address = server.address();
    assert.equal(typeof address, "object");
    if (!address || typeof address !== "object") throw new Error("No test server port");

    const response = await fetch(`http://127.0.0.1:${address.port}/api/chat`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ messages: "not-an-array" }),
    });
    const body = await response.json();

    assert.equal(response.status, 400);
    assert.equal(calledModel, false);
    assert.match(body.error, /messages/i);
  } finally {
    await new Promise<void>((resolve, reject) => {
      server.close((error) => (error ? reject(error) : resolve()));
    });
  }
});

test("security readiness endpoint refuses production-ready claims until real controls exist", async () => {
  const app = createApp({ apiKey: "" });
  const server = app.listen(0);

  try {
    const address = server.address();
    assert.equal(typeof address, "object");
    if (!address || typeof address !== "object") throw new Error("No test server port");

    const response = await fetch(`http://127.0.0.1:${address.port}/api/security/readiness`);
    const body = await response.json();

    assert.equal(response.status, 200);
    assert.equal(body.productionReady, false);
    assert.equal(body.storageMode, "in-memory-demo");
    assert.ok(body.requiredBeforeProduction.includes("server_persistent_database"));
    assert.ok(body.requiredBeforeProduction.includes("encrypted_health_records"));
    assert.ok(body.requiredBeforeProduction.includes("consent_and_audit_retention"));
  } finally {
    await new Promise<void>((resolve, reject) => {
      server.close((error) => (error ? reject(error) : resolve()));
    });
  }
});

test("API responses include conservative security and privacy headers", async () => {
  const app = createApp({ apiKey: "" });
  const server = app.listen(0);

  try {
    const port = getServerPort(server);
    const response = await fetch(`http://127.0.0.1:${port}/api/security/readiness`);

    assert.equal(response.headers.get("x-powered-by"), null);
    assert.equal(response.headers.get("x-content-type-options"), "nosniff");
    assert.equal(response.headers.get("x-frame-options"), "DENY");
    assert.equal(response.headers.get("referrer-policy"), "no-referrer");
    assert.equal(response.headers.get("cache-control"), "no-store");
    assert.match(response.headers.get("permissions-policy") || "", /camera=\(\)/);
  } finally {
    await closeServer(server);
  }
});

test("demo session endpoint requires explicit consent before issuing a server session", async () => {
  const app = createApp({ apiKey: "" });
  const server = app.listen(0);

  try {
    const address = server.address();
    assert.equal(typeof address, "object");
    if (!address || typeof address !== "object") throw new Error("No test server port");

    const response = await fetch(`http://127.0.0.1:${address.port}/api/auth/demo-session`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ user: { id: "u1", email: "parent@example.com", type: "private", name: "Елена" } }),
    });
    const body = await response.json();

    assert.equal(response.status, 403);
    assert.match(body.error, /consent/i);
  } finally {
    await new Promise<void>((resolve, reject) => {
      server.close((error) => (error ? reject(error) : resolve()));
    });
  }
});

test("demo session endpoint issues a server token and records a minimal audit event", async () => {
  const securityStore = createInMemorySecurityStore();
  const app = createApp({ apiKey: "", securityStore });
  const server = app.listen(0);

  try {
    const address = server.address();
    assert.equal(typeof address, "object");
    if (!address || typeof address !== "object") throw new Error("No test server port");

    const response = await fetch(`http://127.0.0.1:${address.port}/api/auth/demo-session`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        consentAccepted: true,
        consentVersion: "demo-consent-v1",
        user: {
          id: "u_b2c_demo",
          email: "parent@example.com",
          type: "private",
          name: "Елена Иванова",
          childBirthdate: "2025-05-15",
        },
      }),
    });
    const body = await response.json();
    const auditEvents = securityStore.listAuditEvents();

    assert.equal(response.status, 201);
    assert.match(body.sessionId, /^sess_/);
    assert.match(body.expiresAt, /^\d{4}-\d{2}-\d{2}T/);
    assert.equal(body.user.email, "parent@example.com");
    assert.equal(body.user.childBirthdate, undefined);
    assert.equal(auditEvents.length, 1);
    assert.equal(auditEvents[0].type, "demo_session_created");
    assert.equal(auditEvents[0].actorEmail, "parent@example.com");
    assert.equal(auditEvents[0].consentVersion, "demo-consent-v1");
  } finally {
    await new Promise<void>((resolve, reject) => {
      server.close((error) => (error ? reject(error) : resolve()));
    });
  }
});

test("child profile API requires a valid server session and consent", async () => {
  const app = createApp({ apiKey: "" });
  const server = app.listen(0);

  try {
    const address = server.address();
    assert.equal(typeof address, "object");
    if (!address || typeof address !== "object") throw new Error("No test server port");

    const response = await fetch(`http://127.0.0.1:${address.port}/api/child-profile`, {
      method: "PUT",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        consentAccepted: true,
        profile: { name: "Максим", gender: "boy", birthdate: "2025-05-15" },
      }),
    });
    const body = await response.json();

    assert.equal(response.status, 401);
    assert.match(body.error, /session/i);
  } finally {
    await new Promise<void>((resolve, reject) => {
      server.close((error) => (error ? reject(error) : resolve()));
    });
  }
});

test("child profile API stores pediatric profile server-side without plaintext raw storage", async () => {
  const securityStore = createInMemorySecurityStore({ healthDataEncryptionKey: "test-health-data-key" });
  const app = createApp({ apiKey: "", securityStore });
  const server = app.listen(0);

  try {
    const address = server.address();
    assert.equal(typeof address, "object");
    if (!address || typeof address !== "object") throw new Error("No test server port");

    const sessionResponse = await fetch(`http://127.0.0.1:${address.port}/api/auth/demo-session`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        consentAccepted: true,
        user: { id: "u_b2c_demo", email: "parent@example.com", type: "private", name: "Елена Иванова" },
      }),
    });
    const session = await sessionResponse.json();

    const profileResponse = await fetch(`http://127.0.0.1:${address.port}/api/child-profile`, {
      method: "PUT",
      headers: {
        "content-type": "application/json",
        authorization: `Bearer ${session.sessionId}`,
      },
      body: JSON.stringify({
        consentAccepted: true,
        profile: { name: "Максим", gender: "boy", birthdate: "2025-05-15" },
      }),
    });
    const profileBody = await profileResponse.json();
    const rawRecord = securityStore.getStoredChildProfileRecord("u_b2c_demo");
    const auditEvents = securityStore.listAuditEvents();

    assert.equal(profileResponse.status, 200);
    assert.equal(profileBody.profile.name, "Максим");
    assert.equal(profileBody.storage.encrypted, true);
    assert.equal(rawRecord?.encrypted, true);
    assert.doesNotMatch(JSON.stringify(rawRecord), /Максим|2025-05-15/);
    assert.equal(auditEvents.at(-1)?.type, "child_profile_saved");
    assert.equal(auditEvents.at(-1)?.actorEmail, "parent@example.com");
  } finally {
    await new Promise<void>((resolve, reject) => {
      server.close((error) => (error ? reject(error) : resolve()));
    });
  }
});

test("child profile read requires a valid server session", async () => {
  const app = createApp({ apiKey: "" });
  const server = app.listen(0);

  try {
    const port = getServerPort(server);
    const response = await fetch(`http://127.0.0.1:${port}/api/child-profile`);
    const body = await response.json();

    assert.equal(response.status, 401);
    assert.match(body.error, /session/i);
  } finally {
    await closeServer(server);
  }
});

test("child profile read returns only the session owner's encrypted profile and records an audit event", async () => {
  const securityStore = createInMemorySecurityStore({ healthDataEncryptionKey: "test-health-data-key" });
  const app = createApp({ apiKey: "", securityStore });
  const server = app.listen(0);

  try {
    const port = getServerPort(server);
    const session = await createDemoSession(port);
    await saveChildProfile(port, session.sessionId);

    const response = await fetch(`http://127.0.0.1:${port}/api/child-profile`, {
      headers: { authorization: `Bearer ${session.sessionId}` },
    });
    const body = await response.json();
    const auditEvents = securityStore.listAuditEvents();

    assert.equal(response.status, 200);
    assert.equal(body.profile.name, "Максим");
    assert.equal(body.storage.encrypted, true);
    assert.match(body.storage.auditId, /^aud_/);
    assert.equal(auditEvents.at(-1)?.type, "child_profile_read");
    assert.equal(auditEvents.at(-1)?.actorEmail, "parent@example.com");
  } finally {
    await closeServer(server);
  }
});

test("child profile read is owner-scoped and ignores client-supplied owner identifiers", async () => {
  const securityStore = createInMemorySecurityStore({ healthDataEncryptionKey: "test-health-data-key" });
  const app = createApp({ apiKey: "", securityStore });
  const server = app.listen(0);

  try {
    const port = getServerPort(server);
    const parentSession = await createDemoSession(port, {
      id: "u_b2c_demo",
      email: "parent@example.com",
      type: "private",
      name: "Елена Иванова",
    });
    const otherSession = await createDemoSession(port, {
      id: "u_other_parent",
      email: "other@example.com",
      type: "private",
      name: "Ольга Петрова",
    });
    await saveChildProfile(port, parentSession.sessionId);

    const response = await fetch(`http://127.0.0.1:${port}/api/child-profile?ownerId=u_b2c_demo`, {
      headers: { authorization: `Bearer ${otherSession.sessionId}` },
    });
    const body = await response.json();

    assert.equal(response.status, 404);
    assert.doesNotMatch(JSON.stringify(body), /Максим|2025-05-15/);
  } finally {
    await closeServer(server);
  }
});

test("file-backed security store persists sessions, encrypted profiles, and audit events across restart", async () => {
  const tempDir = await mkdtemp(path.join(tmpdir(), "pediatr-security-store-"));
  const storePath = path.join(tempDir, "security-store.json");

  try {
    const firstStore = createFileBackedSecurityStore({
      filePath: storePath,
      healthDataEncryptionKey: "stable-test-health-key",
    });
    const session = firstStore.createDemoSession({
      user: { id: "u_file_parent", email: "file-parent@example.com", type: "private", name: "Елена Иванова" },
      consentVersion: "demo-consent-v1",
      requestId: "req_create_file",
    });

    firstStore.saveChildProfile({
      sessionId: session.sessionId,
      profile: { name: "Максим", gender: "boy", birthdate: "2025-05-15" },
      requestId: "req_save_file",
    });

    const rawFile = await readFile(storePath, "utf8");
    assert.doesNotMatch(rawFile, /Максим|2025-05-15/);
    assert.match(rawFile, /child_profile_saved/);

    const restartedStore = createFileBackedSecurityStore({
      filePath: storePath,
      healthDataEncryptionKey: "stable-test-health-key",
    });
    const readProfile = restartedStore.getChildProfile({
      sessionId: session.sessionId,
      requestId: "req_read_after_restart",
    });

    assert.equal(readProfile?.profile.name, "Максим");
    assert.equal(restartedStore.getSession(session.sessionId)?.user.email, "file-parent@example.com");
    assert.equal(restartedStore.getStoredChildProfileRecord("u_file_parent")?.encrypted, true);
    assert.deepEqual(
      restartedStore.listAuditEvents().map((event) => event.type),
      ["demo_session_created", "child_profile_saved", "child_profile_read"]
    );
  } finally {
    await rm(tempDir, { force: true, recursive: true });
  }
});
