import test, { type TestContext } from "node:test";
import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { mkdtempSync, mkdirSync, writeFileSync, readFileSync, rmSync, existsSync } from "node:fs";
import { tmpdir } from "node:os";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const formatter = fileURLToPath(new URL("../bin/agent-format.ts", import.meta.url));
const linter = fileURLToPath(new URL("../bin/agent-lint.ts", import.meta.url));
const installer = fileURLToPath(new URL("../bin/install.ts", import.meta.url));

function workspace(t: TestContext): string {
  const directory = mkdtempSync(join(tmpdir(), "agent format fixtures "));

  t.after(() => rmSync(directory, { recursive: true, force: true }));

  return directory;
}

function write(directory: string, name: string, content: string): string {
  const path = join(directory, name);

  mkdirSync(dirname(path), { recursive: true });
  writeFileSync(path, content);

  return path;
}

function invoke(cwd: string, arguments_: string[] = [], runner = formatter) {
  return spawnSync(process.execPath, [runner, ...arguments_], { cwd, encoding: "utf8" });
}

function assertSuccess(result: ReturnType<typeof invoke>) {
  assert.equal(result.error, undefined);
  assert.equal(result.status, 0, result.stdout + result.stderr);
}

test("default formatting checks are nonmutating and explicit writes produce passing TypeScript", (t) => {
  // Given unformatted typed source in the current directory.
  const cwd = workspace(t);
  const source = "export function double(value:number){return value*2}";
  const file = write(cwd, "example.ts", source);

  // When checking without a write flag.
  assert.notEqual(invoke(cwd).status, 0);

  // Then the default check preserves the original source.
  assert.equal(readFileSync(file, "utf8"), source);

  // When explicitly formatting and checking again.
  assertSuccess(invoke(cwd, ["--write"]));
  assertSuccess(invoke(cwd));

  // Then formatting changed the source and a repeated write is stable.
  const formatted = readFileSync(file, "utf8");

  assert.notEqual(formatted, source);
  assertSuccess(invoke(cwd, ["--write"]));
  assert.equal(readFileSync(file, "utf8"), formatted);
});

test("spacing fixes and formatting compose into stable output accepted by both tools", (t) => {
  // Given a typed callback needing both spacing and ordinary formatting.
  const cwd = workspace(t);
  const file = write(
    cwd,
    "example.ts",
    "const doubled:number[]=[1,2].map((value:number)=>{const result=value*2;return result;});\n",
  );

  // When lint spacing is fixed before formatting is written.
  assertSuccess(invoke(cwd, ["--fix", file], linter));
  assertSuccess(invoke(cwd, ["--write", file]));

  // Then both tools accept the output and the business-step blank line remains.
  const formatted = readFileSync(file, "utf8");

  assert.match(formatted, /const result = value \* 2;\n\n\s+return result;/);
  assertSuccess(invoke(cwd, [file], linter));
  assertSuccess(invoke(cwd, [file]));
  assertSuccess(invoke(cwd, ["--fix", file], linter));
  assertSuccess(invoke(cwd, ["--write", file]));
  assert.equal(readFileSync(file, "utf8"), formatted);
});

test("device formatting prevails over nested config, project ignore, and editorconfig", (t) => {
  // Given project preferences opposite to the device settings and an ignored nested file.
  const cwd = workspace(t);
  const opposite = JSON.stringify({ useTabs: true, tabWidth: 8, semi: false, singleQuote: true });

  write(cwd, ".oxfmtrc.json", opposite);
  write(cwd, "nested/.oxfmtrc.json", opposite);
  write(cwd, ".prettierignore", "nested/**\n");
  write(
    cwd,
    ".editorconfig",
    "root = true\n[*]\nindent_style = tab\nindent_size = 8\nend_of_line = crlf\ninsert_final_newline = false\n",
  );
  const file = write(
    cwd,
    "nested/example.ts",
    "export function message(){const value:string='hello';return value}",
  );

  // When formatting from the root without naming the ignored file explicitly.
  assert.notEqual(invoke(cwd).status, 0);
  assertSuccess(invoke(cwd, ["--write"]));

  // Then explicit device preferences win and nested source is formatted.
  const formatted = readFileSync(file, "utf8");

  assert.match(formatted, /\n  const value: string = "hello";/);
  assert.match(formatted, /return value;/);
  assert.ok(formatted.endsWith("\n"));
  assert.ok(!formatted.includes("\t"));
  assert.ok(!formatted.includes("\r"));
  assertSuccess(invoke(cwd));
});

test("formatter configuration override flags are rejected before touching source", (t) => {
  // Given unformatted source and CLI options that could replace device preferences.
  const cwd = workspace(t);
  const source = "const value=1";
  const file = write(cwd, "example.ts", source);

  for (const option of [
    "--config",
    "--config=other.json",
    "--ignore-path",
    "--no-config",
    "--check",
  ]) {
    // When an unsupported flag is supplied.
    const result = invoke(cwd, [option, file]);

    // Then the wrapper rejects it and preserves the source.
    assert.equal(result.status, 2, option);
    assert.match(result.stderr, /Unsupported option/);
    assert.equal(readFileSync(file, "utf8"), source);
  }
});

test("a temporary formatter launcher works from arbitrary directories with spaced paths", (t) => {
  // Given a temporary bin directory separate from the source project.
  const cwd = workspace(t);
  const bin = join(cwd, "tools with spaces and 'quotes'");
  const project = join(cwd, "another project");
  const file = write(project, "typed source with spaces.ts", "const value:number=1");

  assertSuccess(invoke(project, [bin], installer));

  // When invoking the installed formatter with a literal spaced path.
  const launcher = join(bin, "agent-format");
  const run = (arguments_: string[]) =>
    spawnSync(launcher, arguments_, { cwd: project, encoding: "utf8" });

  assert.notEqual(run([file]).status, 0);
  assertSuccess(run(["--write", file]));

  // Then the owned formatter works and the resulting file passes its default check.
  assertSuccess(run([file]));
  assertSuccess(run(["--help"]));
  assert.match(readFileSync(file, "utf8"), /const value: number = 1;/);
});

test("a conflicting formatter destination prevents installation of either launcher", (t) => {
  // Given an unrelated formatter executable and no linter launcher.
  const cwd = workspace(t);
  const bin = join(cwd, "bin");
  const existing = "#!/bin/sh\nexit 42\n";
  const formatterLauncher = write(bin, "agent-format", existing);

  // When the two-launcher installer preflights the destination directory.
  const result = invoke(cwd, [bin], installer);

  // Then it refuses before installing anything and preserves the conflicting file.
  assert.notEqual(result.status, 0);
  assert.match(result.stderr, /Refusing to replace an unrelated executable/);
  assert.equal(readFileSync(formatterLauncher, "utf8"), existing);
  assert.equal(existsSync(join(bin, "agent-lint")), false);
});
