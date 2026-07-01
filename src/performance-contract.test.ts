import test from "node:test";
import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";

test("pdf export library is loaded on demand", () => {
  const app = readFileSync("src/App.tsx", "utf8");

  assert.doesNotMatch(app, /import\s+\{\s*jsPDF\s*\}\s+from\s+["']jspdf["']/);
  assert.match(app, /await import\(["']jspdf["']\)/);
});

test("growth chart library is isolated from the main app bundle", () => {
  const app = readFileSync("src/App.tsx", "utf8");

  assert.doesNotMatch(app, /from\s+["']recharts["']/);
  assert.match(app, /React\.lazy\(\(\) => import\(["']\.\/components\/GrowthChart["']\)\)/);
  assert.equal(existsSync("src/components/GrowthChart.tsx"), true);
});

test("growth chart waits for measured dimensions before rendering recharts", () => {
  const chart = readFileSync("src/components/GrowthChart.tsx", "utf8");

  assert.doesNotMatch(chart, /ResponsiveContainer/);
  assert.match(chart, /ResizeObserver/);
  assert.match(chart, /chartSize\.width > 0/);
  assert.match(chart, /width=\{chartSize\.width\}/);
  assert.match(chart, /height=\{chartSize\.height\}/);
});
