import test, { type TestContext } from "node:test";
import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { mkdtempSync, mkdirSync, writeFileSync, readFileSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const runner = fileURLToPath(new URL("../bin/agent-lint.ts", import.meta.url));

function workspace(t: TestContext): string {
  const directory = mkdtempSync(join(tmpdir(), "agent contracts "));

  t.after(() => rmSync(directory, { recursive: true, force: true }));

  return directory;
}

function write(directory: string, name: string, source: string): string {
  const file = join(directory, name);

  mkdirSync(dirname(file), { recursive: true });
  writeFileSync(file, source);

  return file;
}

function lint(cwd: string, file: string, fix = false) {
  return spawnSync(process.execPath, [runner, ...(fix ? ["--fix"] : []), file], {
    cwd,
    encoding: "utf8",
  });
}

test("contract violations fail without autofixing domain decisions", (t) => {
  // Given syntactically formatted TypeScript with uncertain and inline contracts.
  const cwd = workspace(t);
  const source =
    "export function handle(input: { value: unknown }): { value: number } {\n  return { value: 1 };\n}\n";
  const file = write(cwd, "example.ts", source);
  // When fixing through the real CLI.
  const result = lint(cwd, file, true);

  // Then contract diagnostics remain and source is not rewritten.
  assert.notEqual(result.status, 0);
  assert.match(result.stdout + result.stderr, /no-unknown/);
  assert.match(result.stdout + result.stderr, /named-function-contracts/);
  assert.equal(readFileSync(file, "utf8"), source);

  const anyFile = write(cwd, "any.ts", "const input: any = JSON.parse('{}');\n");
  const anyResult = lint(cwd, anyFile);

  assert.notEqual(anyResult.status, 0);
  assert.match(anyResult.stdout + anyResult.stderr, /no-explicit-any/);
});

test("named contracts and domain constants pass without banning ordinary labels", (t) => {
  // Given named shapes, explicit export returns, and named role/status values.
  const cwd = workspace(t);
  const source = `interface Request { label: string; }
interface Response { label: string; }
const ActorRole = { Admin: "admin" } as const;
const OrderStatus = { Filled: "filled" } as const;

type OrderStatus = typeof OrderStatus[keyof typeof OrderStatus];

export function handle(input: Request): Response {
  return { label: input.label };
}

function status(): OrderStatus {
  return OrderStatus.Filled;
}

const actor = { role: ActorRole.Admin, label: "administrator" };
const order = { status: OrderStatus.Filled, label: "filled order" };

order.status = OrderStatus.Filled;

if (actor.role === ActorRole.Admin && order.status === OrderStatus.Filled) {
  console.log("ordinary label");
}
`;
  const file = write(cwd, "example.ts", source);
  // When linting the named contracts.
  const result = lint(cwd, file);

  // Then all policy checks accept the source.
  assert.equal(result.status, 0, result.stdout + result.stderr);
});

test("unknown is permitted only at named boundaries and inferred catch remains valid", (t) => {
  // Given the same unknown annotation in ordinary and explicit boundary paths.
  const cwd = workspace(t);
  const source = "const input: unknown = JSON.parse('{}');\n";
  const ordinary = write(cwd, "src/example.ts", source);

  // When checking each permitted boundary spelling.
  assert.notEqual(lint(cwd, ordinary).status, 0);

  for (const name of [
    "src/boundaries/input.ts",
    "src/input.boundary.ts",
    "src/input.boundary.tsx",
    "src/input.boundary.mts",
    "src/input.boundary.cts",
  ]) {
    const result = lint(cwd, write(cwd, name, source));

    // Then genuine boundary files allow uncertain external input.
    assert.equal(result.status, 0, result.stdout + result.stderr);
  }

  const caught = write(
    cwd,
    "src/catch.ts",
    "try {\n  JSON.parse('{}');\n} catch (error) {\n  console.log(error);\n}\n",
  );

  assert.equal(lint(cwd, caught).status, 0);

  const explicitCatch = write(
    cwd,
    "src/explicit-catch.ts",
    "try {\n  JSON.parse('{}');\n} catch (error: unknown) {\n  console.log(error);\n}\n",
  );

  assert.equal(lint(cwd, explicitCatch).status, 0);

  const boundary = write(
    cwd,
    "src/validate.boundary.ts",
    'interface Input { role: unknown; status: unknown; }\n\nconst input: Input = JSON.parse(\'{}\');\n\nif (typeof input.role === "string" && typeof input.status === "string") {\n  console.log("validated shape");\n}\n',
  );
  const boundaryResult = lint(cwd, boundary);

  assert.equal(boundaryResult.status, 0, boundaryResult.stdout + boundaryResult.stderr);
});

test("inline contracts are rejected for arrows and methods and exported returns must be explicit", (t) => {
  // Given three different function forms violating their contract policy.
  const cwd = workspace(t);
  const fixtures = [
    [
      "arrow.ts",
      "const handle = (input: { value: number }): { value: number } => input;\n",
      "named-function-contracts",
    ],
    [
      "method.ts",
      "const handler = {\n  handle(input: { value: number }): { value: number } {\n    return input;\n  },\n};\n",
      "named-function-contracts",
    ],
    ["export.ts", "export function handle() {\n  return 1;\n}\n", "explicit-export-return"],
  ];

  for (const [name, source, rule] of fixtures) {
    // When linting the actual TypeScript syntax.
    const result = lint(cwd, write(cwd, name, source));

    // Then the corresponding contract rule reports a failure.
    assert.notEqual(result.status, 0);
    assert.match(result.stdout + result.stderr, new RegExp(rule));
  }
});

test("raw domain values are rejected for properties, assignments, comparisons, and status returns", (t) => {
  // Given raw domain strings in each supported runtime context.
  const cwd = workspace(t);
  const fixtures = [
    'const actor = { role: "admin" };\n',
    'const order = { status: "filled" };\n',
    'const order = { "status": "filled" };\n',
    'order.status = "filled";\n',
    'order["status"] = "filled";\n',
    'if (actor.role === "admin") {\n  console.log("label");\n}\n',
    'if ("filled" === order.status) {\n  console.log("label");\n}\n',
    'type ExecutionStatus = "completed";\n\nfunction status(): ExecutionStatus {\n  return "completed";\n}\n',
  ];

  for (const [index, source] of fixtures.entries()) {
    // When each domain use is checked through the CLI.
    const result = lint(cwd, write(cwd, `example-${index}.ts`, source));

    // Then a domain-value diagnostic is produced.
    assert.notEqual(result.status, 0);
    assert.match(result.stdout + result.stderr, /named-domain-values/);
  }
});

test("JavaScript remains outside TypeScript contract requirements", (t) => {
  // Given valid JavaScript using inferred shapes and raw domain strings.
  const cwd = workspace(t);
  const file = write(
    cwd,
    "example.js",
    'export function actor() {\n  return { role: "admin", status: "filled", label: "ordinary" };\n}\n',
  );
  // When the JavaScript source is checked.
  const result = lint(cwd, file);

  // Then TypeScript-only contract requirements do not report it.
  assert.equal(result.status, 0, result.stdout + result.stderr);
});
