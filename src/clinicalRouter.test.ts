import test from "node:test";
import assert from "node:assert/strict";

import {
  detectEmergencyTriage,
  detectPediatricCareRoute,
  PEDIATRIC_CARE_ROUTE_RULES,
} from "./clinicalRouter";

test("clinical router exposes deterministic rules with source ids", () => {
  assert.ok(PEDIATRIC_CARE_ROUTE_RULES.length >= 3);
  assert.ok(PEDIATRIC_CARE_ROUTE_RULES.every((rule) => rule.id && rule.level && rule.sourceId));
  assert.ok(PEDIATRIC_CARE_ROUTE_RULES.some((rule) => rule.id === "infant-under-3-months-fever"));
  assert.ok(PEDIATRIC_CARE_ROUTE_RULES.some((rule) => rule.id === "fever-with-repeated-vomiting-or-diarrhea"));
});

test("clinical router keeps emergency red flags above urgent same-day routes", () => {
  const route = detectPediatricCareRoute("Ребенку 2 месяца, температура 38.2, губы синеют");

  assert.equal(route?.level, "emergency");
  assert.ok(route?.matchedSignals.includes("blue_lips_or_skin"));
  assert.match(route?.reply || "", /103|112/);
});

test("clinical router routes fever with repeated vomiting or diarrhea to same-day pediatric care", () => {
  const route = detectPediatricCareRoute("Ребенку 5 лет, температура 38.7, повторная рвота и диарея весь вечер");

  assert.equal(route?.level, "urgent_same_day");
  assert.ok(route?.matchedSignals.includes("fever_with_repeated_vomiting_or_diarrhea"));
  assert.match(route?.reply || "", /свяжитесь с педиатром/i);
});

test("clinical router escalates meningitis-like fever red flags before model use", () => {
  const route = detectPediatricCareRoute("У ребенка температура 39, ригидная шея и больно смотреть на свет");

  assert.equal(route?.level, "emergency");
  assert.ok(route?.matchedSignals.includes("stiff_neck_light_sensitivity"));
  assert.match(route?.reply || "", /103|112/);
});

test("clinical router escalates sudden purple bruise-like rash before model use", () => {
  const route = detectPediatricCareRoute("Температура 39 и внезапно появилась фиолетовая сыпь как синяки");

  assert.equal(route?.level, "emergency");
  assert.ok(route?.matchedSignals.includes("purple_bruise_like_rash"));
  assert.match(route?.reply || "", /103|112/);
});

test("clinical router routes fever with unexplained rash to same-day pediatric care", () => {
  const route = detectPediatricCareRoute("Ребенку 4 года, температура 38.6 и появилась непонятная сыпь на теле");

  assert.equal(route?.level, "urgent_same_day");
  assert.ok(route?.matchedSignals.includes("fever_with_unexplained_rash"));
  assert.match(route?.reply || "", /педиатром/i);
});

test("standalone emergency detector remains available for direct audits", () => {
  const route = detectEmergencyTriage("Судороги и ребенок не просыпается");

  assert.equal(route?.level, "emergency");
  assert.ok(route?.matchedSignals.includes("seizure"));
  assert.ok(route?.matchedSignals.includes("unresponsive"));
});
