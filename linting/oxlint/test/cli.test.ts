import test, { type TestContext } from "node:test";
import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import {
  mkdtempSync,
  mkdirSync,
  writeFileSync,
  readFileSync,
  rmSync,
  chmodSync,
  symlinkSync,
  readlinkSync,
  existsSync,
} from "node:fs";
import { tmpdir } from "node:os";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const runner = fileURLToPath(new URL("../bin/agent-lint.ts", import.meta.url));
const installer = fileURLToPath(new URL("../bin/install.ts", import.meta.url));

function workspace(t: TestContext): string {
  const directory = mkdtempSync(join(tmpdir(), "agent lint fixtures "));

  t.after(() => rmSync(directory, { recursive: true, force: true }));

  return directory;
}

function write(directory: string, name: string, content: string): string {
  const path = join(directory, name);

  mkdirSync(dirname(path), { recursive: true });
  writeFileSync(path, content);

  return path;
}

function invoke(cwd: string, arguments_: string[] = [], executable = process.execPath) {
  return spawnSync(
    executable,
    executable === process.execPath ? [runner, ...arguments_] : arguments_,
    { cwd, encoding: "utf8" },
  );
}

function assertSuccess(result: ReturnType<typeof invoke>) {
  assert.equal(result.error, undefined);
  assert.equal(result.status, 0, result.stdout + result.stderr);
}

const allocation = `function allocate(components, budgetCents) {
  const allocated = components.map((component, index) => {
    const exact = budgetCents * component.weightBps / 10000;
    return { ...component, index, notionalCents: Math.floor(exact), remainder: exact % 1 };
  });
  let remaining = budgetCents - allocated.reduce((sum, component) => sum + component.notionalCents, 0);
  const ranked = [...allocated].sort((a, b) => b.remainder - a.remainder || a.index - b.index);
  for (const component of ranked) {
    if (remaining === 0) {
      break;
    }
    component.notionalCents += 1;
    remaining -= 1;
  }
  return allocated;
}
`;

test("allocation spacing is enforced and autofix is stable", (t) => {
  // Given the original cramped allocation flow in a temporary project.
  const cwd = workspace(t);
  const file = write(cwd, "allocation.js", allocation);

  // When the actual CLI checks and fixes it.
  assert.notEqual(invoke(cwd).status, 0);
  assertSuccess(invoke(cwd, ["--fix"]));
  const fixed = readFileSync(file, "utf8");

  // Then the three critical omissions are fixed and related declarations stay adjacent.
  assert.match(fixed, /const exact =[^\n]+;\n\n    return/);
  assert.match(fixed, /let remaining =[^\n]+;\n\n  const ranked/);
  assert.match(fixed, /const ranked =[^\n]+;\n\n  for/);
  assert.match(fixed, /\n  \}\);\n  let remaining/);
  assertSuccess(invoke(cwd));
  assertSuccess(invoke(cwd, ["--fix"]));
  assert.equal(readFileSync(file, "utf8"), fixed);
});

test("all advertised JavaScript and TypeScript extensions are checked and fixed", (t) => {
  // Given cramped callbacks in each supported source extension.
  const cwd = workspace(t);
  const fixtures = {
    js: "const result = [1].map(value => { const doubled = value * 2; return doubled; });\n",
    jsx: "const view = <span>Hello</span>;\nconst result = [1].map(value => { const doubled = value * 2; return doubled; });\n",
    cjs: "module.exports = function () { const value = 1; return value; };\n",
    mjs: "export function example() { const value = 1; return value; }\n",
    ts: "const result: number[] = [1].map((value: number) => { const doubled: number = value * 2; return doubled; });\n",
    tsx: "const view = <span>Hello</span>;\nconst result: number[] = [1].map((value: number) => { const doubled = value * 2; return doubled; });\n",
    cts: "const result: number[] = [1].map((value: number) => { const doubled = value * 2; return doubled; });\n",
    mts: "export function example(): number { const value = 1; return value; }\n",
  };

  for (const [extension, source] of Object.entries(fixtures)) {
    const file = write(cwd, `example.${extension}`, source);

    // When each file is checked individually through the CLI.
    assert.notEqual(invoke(cwd, [file]).status, 0, extension);
    assertSuccess(invoke(cwd, ["--fix", file]));
    // Then a real fix occurred and its output passes a fresh check.
    assert.notEqual(readFileSync(file, "utf8"), source, extension);
    assertSuccess(invoke(cwd, [file]));
  }
});

test("collection transforms are separate steps while ordinary declarations stay grouped", (t) => {
  // Given each supported collection method beside related declarations.
  const cwd = workspace(t);

  for (const method of ["map", "filter", "flatMap", "reduce", "sort", "toSorted"]) {
    const source = `const values = [1, 2];\nconst result = values.${method}(value => value);\nconst related = result;\n`;
    const file = write(cwd, `${method}.js`, source);

    // When the CLI autofixes the file.
    assertSuccess(invoke(cwd, ["--fix", file]));
    // Then the transform alone receives a separating blank line.
    assert.equal(
      readFileSync(file, "utf8"),
      source.replace(";\nconst result", ";\n\nconst result"),
    );
  }
});

test("whitespace cleanup removes trailing spaces and excess blanks and adds a final newline", (t) => {
  // Given inconsistent line and file boundaries.
  const cwd = workspace(t);
  const file = write(cwd, "example.js", "const first = 1;  \n\n\nconst second = 2;");

  // When the device CLI fixes whitespace.
  assert.notEqual(invoke(cwd, [file]).status, 0);
  assertSuccess(invoke(cwd, ["--fix", file]));
  // Then only the intended clean whitespace remains.
  assert.equal(readFileSync(file, "utf8"), "const first = 1;\n\nconst second = 2;\n");
  assertSuccess(invoke(cwd, [file]));
});

test("device rules prevail over project configs, ignores, and a project-local fake binary", (t) => {
  // Given project and nested configs disabling rules, ignored source, and a fake local CLI.
  const cwd = workspace(t);
  const disabled = JSON.stringify({ rules: { "coding-agent-style/eol-last": "off" } });

  write(cwd, ".oxlintrc.json", disabled);
  write(cwd, "nested/.oxlintrc.json", disabled);
  write(cwd, ".eslintignore", "nested/**\n");
  const file = write(cwd, "nested/example.js", "const value = 1;");
  const marker = join(cwd, "fake-was-invoked");
  const fake = write(cwd, "node_modules/.bin/oxlint", `#!/bin/sh\ntouch '${marker}'\nexit 0\n`);

  chmodSync(fake, 0o755);
  // When checking from the project root, including the ignored nested file.
  assert.notEqual(invoke(cwd).status, 0);
  assertSuccess(invoke(cwd, ["--fix"]));
  // Then the owned CLI applies device rules despite all project-level alternatives.
  assert.equal(readFileSync(file, "utf8"), "const value = 1;\n");
  assert.throws(() => readFileSync(marker), { code: "ENOENT" });
});

test("unsupported configuration and disabling flags are rejected", (t) => {
  // Given CLI options that could replace or weaken the device policy.
  const cwd = workspace(t);
  const file = write(cwd, "example.js", "const value = 1;");

  for (const option of [
    "--config",
    "--config=other.json",
    "--no-ignore",
    "--disable-nested-config",
    "--allow",
    "--max-warnings",
    "--ignore-path",
  ]) {
    // When a caller attempts to pass an unsupported option.
    const result = invoke(cwd, [option, file]);

    // Then the wrapper fails before modifying source.
    assert.equal(result.status, 2, option);
    assert.match(result.stderr, /Unsupported option/);
    assert.equal(readFileSync(file, "utf8"), "const value = 1;");
  }
});

test("a temporary installed launcher works from arbitrary directories and accepts paths with spaces", (t) => {
  // Given a temporary installation location and an unrelated working directory.
  const cwd = workspace(t);
  const bin = join(cwd, "tools with spaces and 'quotes'");
  const project = join(cwd, "project elsewhere");
  const file = write(project, "source with spaces.js", "const value = 1;");
  const installed = spawnSync(process.execPath, [installer, bin], {
    cwd: project,
    encoding: "utf8",
  });

  assertSuccess(installed);
  // When the installed launcher is invoked with the literal source path.
  const launcher = join(bin, "agent-lint");

  assert.notEqual(invoke(project, [file], launcher).status, 0);
  assertSuccess(invoke(project, ["--fix", file], launcher));
  // Then the launcher invokes the owned runner correctly and source passes.
  assert.equal(readFileSync(file, "utf8"), "const value = 1;\n");
  assertSuccess(invoke(project, [file], launcher));
});

test("installation preserves unrelated executables and refreshes managed launchers", (t) => {
  // Given an unrelated executable in the requested installation directory.
  const cwd = workspace(t);
  const bin = join(cwd, "bin");
  const launcher = write(bin, "agent-lint", "#!/bin/sh\nexit 42\n");

  chmodSync(launcher, 0o755);
  // When installation attempts to replace it.
  const refused = spawnSync(process.execPath, [installer, bin], { cwd, encoding: "utf8" });

  // Then it refuses and preserves the existing file.
  assert.notEqual(refused.status, 0);
  assert.match(refused.stderr, /Refusing to replace an unrelated executable/);
  assert.equal(readFileSync(launcher, "utf8"), "#!/bin/sh\nexit 42\n");

  // Given a launcher carrying the managed marker but an outdated command.
  writeFileSync(launcher, "#!/bin/sh\n# coding-agent-setup managed launcher\nexit 42\n");
  chmodSync(launcher, 0o644);
  // When installing again.
  assertSuccess(spawnSync(process.execPath, [installer, bin], { cwd, encoding: "utf8" }));
  // Then the refreshed launcher runs the current tool.
  assertSuccess(invoke(cwd, ["--help"], launcher));
});

test("installation refuses dangling symlinks without creating their targets", (t) => {
  // Given an installation destination that is a dangling symbolic link.
  const cwd = workspace(t);
  const target = join(cwd, "unrelated missing target");
  const launcher = join(cwd, "agent-lint");

  symlinkSync(target, launcher);

  // When installation attempts to write the launcher.
  const result = spawnSync(process.execPath, [installer, cwd], { cwd, encoding: "utf8" });

  // Then the symlink remains untouched and its target is never created.
  assert.notEqual(result.status, 0);
  assert.equal(readlinkSync(launcher), target);
  assert.equal(existsSync(target), false);
});
