import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

test("index metadata is Russian and product-specific", () => {
  const html = readFileSync("index.html", "utf8");

  assert.match(html, /<html lang="ru">/);
  assert.match(html, /<title>Заботливый Педиатр/);
  assert.match(html, /name="description"/);
  assert.match(html, /rel="icon"/);
});

test("first-screen copy avoids unverified patient-volume and outcome claims", () => {
  const app = readFileSync("src/App.tsx", "utf8");

  assert.doesNotMatch(app, /5000\+/);
  assert.doesNotMatch(app, /100%\s*<\//);
  assert.doesNotMatch(app, /лучший врач в нашей жизни/i);
  assert.doesNotMatch(app, /обученная на лучших медицинских протоколах/i);
  assert.doesNotMatch(app, /бронируйте лучших педиатров/i);
});

test("demo auth is not marketed as compliant production security", () => {
  const app = readFileSync("src/App.tsx", "utf8");

  assert.doesNotMatch(app, /Защищенная авторизация/);
  assert.doesNotMatch(app, /Соответствие ФЗ-152/);
  assert.match(app, /Демо-кабинет/);
  assert.match(app, /не вводите реальные медицинские данные/);
});

test("vaccine tooltip positioning avoids mobile right-edge overflow", () => {
  const app = readFileSync("src/App.tsx", "utf8");

  assert.doesNotMatch(app, /absolute bottom-full left-0 mb-2 w-72 bg-slate-950/);
  assert.match(app, /max-w-\[calc\(100vw-2rem\)\]/);
});

test("demo quick login goes through server-side consent session endpoint", () => {
  const app = readFileSync("src/App.tsx", "utf8");

  assert.match(app, /\/api\/auth\/demo-session/);
  assert.match(app, /consentAccepted:\s*true/);
  assert.match(app, /pediatr_auth_session_token/);
});

test("child profile save attempts server-side persistence when demo session exists", () => {
  const app = readFileSync("src/App.tsx", "utf8");

  assert.match(app, /\/api\/child-profile/);
  assert.match(app, /Authorization/);
  assert.match(app, /pediatr_auth_session_token/);
});

test("child profile can hydrate from the owner-scoped server endpoint", () => {
  const app = readFileSync("src/App.tsx", "utf8");

  assert.match(app, /loadChildProfileFromServer/);
  assert.match(app, /method:\s*"GET"/);
  assert.match(app, /Серверный профиль загружен/);
});

test("chat UI has an emergency triage state for red-flag model bypasses", () => {
  const app = readFileSync("src/App.tsx", "utf8");

  assert.match(app, /emergencyTriage/);
  assert.match(app, /border-red-200/);
  assert.match(app, /Экстренная маршрутизация/);
});

test("chat UI has an urgent pediatric care-route state", () => {
  const app = readFileSync("src/App.tsx", "utf8");

  assert.match(app, /careRoute/);
  assert.match(app, /border-amber-200/);
  assert.match(app, /Срочная связь с педиатром/);
  assert.match(app, /Температура у младенца/);
  assert.match(app, /8 недель, температура 38\.2/);
});

test("first screen is task-first pediatric care cockpit, not generic doctor landing", () => {
  const app = readFileSync("src/App.tsx", "utf8");

  assert.match(app, /id="care_cockpit_hero"/);
  assert.match(app, /Сначала определим уровень помощи/);
  assert.match(app, /Экстренно/);
  assert.match(app, /Сегодня к педиатру/);
  assert.match(app, /Планово/);
  assert.match(app, /Какой следующий шаг/);
});

test("AI chat presents structured pediatric intake before freeform prompt", () => {
  const app = readFileSync("src/App.tsx", "utf8");

  assert.match(app, /id="structured_intake_rail"/);
  assert.match(app, /Возраст и вес/);
  assert.match(app, /Температура и динамика/);
  assert.match(app, /Фото\/видео симптома/);
  assert.match(app, /Когда не ждать ответ/);
});
