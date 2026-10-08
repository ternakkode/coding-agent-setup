import test, { type TestContext } from "node:test";
import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { mkdtempSync, writeFileSync, readFileSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

const runner = fileURLToPath(new URL("../bin/agent-lint.ts", import.meta.url));

function fixture(t: TestContext, source: string): string {
  const directory = mkdtempSync(join(tmpdir(), "agent quality "));

  t.after(() => rmSync(directory, { recursive: true, force: true }));
  const file = join(directory, "example.js");

  writeFileSync(file, source);

  return file;
}

function lint(file: string, fix = false) {
  return spawnSync(process.execPath, [runner, ...(fix ? ["--fix"] : []), file], {
    encoding: "utf8",
  });
}

test("a single-line guard is separated from the following declaration", (t) => {
  // Given an early return immediately before another business step.
  const source =
    "function example(value) {\n  if (!value) return;\n  const result = value;\n\n  return result;\n}\n";
  const file = fixture(t, source);

  // When the actual CLI checks and fixes spacing.
  assert.notEqual(lint(file).status, 0);
  const fixed = lint(file, true);

  // Then the guard has a blank line after it and a fresh check passes.
  assert.equal(fixed.status, 0, fixed.stdout + fixed.stderr);
  assert.equal(
    readFileSync(file, "utf8"),
    source.replace("return;\n  const", "return;\n\n  const"),
  );
  assert.equal(lint(file).status, 0);
});

test("complex functions, deep nesting, and long function bodies are rejected", (t) => {
  // Given independent functions crossing each agreed maintainability threshold.
  const branches = Array.from(
    { length: 13 },
    (_, index) => `  if (value === ${index}) {\n    console.log(value);\n  }`,
  ).join("\n\n");
  const depth =
    "function example(value) {\n" +
    "  if (value) {\n".repeat(5) +
    "    console.log(value);\n" +
    "  }\n".repeat(5) +
    "}\n";
  const lines = "function example() {\n" + "  console.log('step');\n".repeat(101) + "}\n";
  const cases = [
    { source: `function example(value) {\n${branches}\n}\n`, rule: "complexity" },
    { source: depth, rule: "max-depth" },
    { source: lines, rule: "max-lines-per-function" },
  ];

  for (const scenario of cases) {
    // When linting the actual function rather than inspecting emitted config objects.
    const result = lint(fixture(t, scenario.source));

    // Then the corresponding static limit produces a failure.
    assert.notEqual(result.status, 0);
    assert.match(result.stdout + result.stderr, new RegExp(scenario.rule));
  }
});

test("comments and blank lines do not consume the function line budget", (t) => {
  // Given more than one hundred physical lines documenting a small function.
  const comments = Array.from({ length: 110 }, (_, index) => `  // Explanation ${index}\n`).join(
    "\n",
  );
  const file = fixture(t, `function example() {\n${comments}\n  console.log('step');\n}\n`);

  // When checking the documented function.
  const result = lint(file);

  // Then its small executable body passes despite the comment and blank line count.
  assert.equal(result.status, 0, result.stdout + result.stderr);
});

test("schema definitions are separated while parse results stay attached to their failure guard", (t) => {
  // Given adjacent schema definitions and a detached parse failure guard.
  const source = `import * as v from "valibot";

const identifier = v.pipe(v.string(), v.minLength(1));
const basketSchema = v.strictObject({ id: identifier });
const executionSchema = v.strictObject({ id: identifier });
const first = 1;
const second = 2;

function decode(value) {
  const result = v.safeParse(basketSchema, value);

  if (!result.success) throw new Error("Invalid basket");
  const parsed = result.output;

  return parsed;
}
`;
  const file = fixture(t, source);

  // When the device CLI applies the requested schema and guard conventions.
  assert.notEqual(lint(file).status, 0);
  const result = lint(file, true);

  // Then schema declarations separate, the validation pair stays together, and ordinary declarations group.
  assert.equal(result.status, 0, result.stdout + result.stderr);
  const fixed = readFileSync(file, "utf8");

  assert.match(fixed, /v\.minLength\(1\)\);\n\nconst basketSchema/);
  assert.match(fixed, /id: identifier \}\);\n\nconst executionSchema/);
  assert.match(fixed, /const first = 1;\nconst second = 2;/);
  assert.match(
    fixed,
    /const result = v\.safeParse\(basketSchema, value\);\n  if \(!result\.success\) throw/,
  );
  assert.match(fixed, /throw new Error\("Invalid basket"\);\n\n  const parsed/);
  assert.equal(lint(file).status, 0);
  assert.equal(lint(file, true).status, 0);
  assert.equal(readFileSync(file, "utf8"), fixed);
});

test("ordinary parse-like declarations and unrelated guards retain their business-step separation", (t) => {
  // Given a guard unrelated to the immediately preceding parse result.
  const source = `function example(value) {
  const result = v.safeParse(schema, value);
  if (!value) throw new Error("Missing value");
  const other = value;
  if (!other.success) throw new Error("Other failure");
  const output = result.output;

  return output;
}
`;
  const file = fixture(t, source);

  // When spacing is fixed without a matching safeParse-result failure guard.
  const result = lint(file, true);

  // Then both unrelated guards preserve the normal blank-line boundaries.
  assert.equal(result.status, 0, result.stdout + result.stderr);
  const fixed = readFileSync(file, "utf8");

  assert.match(fixed, /v\.safeParse\(schema, value\);\n\n  if \(!value\)/);
  assert.match(fixed, /const other = value;\n\n  if \(!other\.success\)/);
  assert.match(fixed, /throw new Error\("Missing value"\);\n\n  const other/);
  assert.equal(lint(file).status, 0);
});
