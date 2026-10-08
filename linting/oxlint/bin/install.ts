import { chmodSync, lstatSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { homedir } from "node:os";
import { join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const arguments_ = process.argv.slice(2);

if (arguments_.length > 1 || arguments_[0]?.startsWith("-")) {
  console.error("Usage: npm run install:device -- [bin-directory]");
  process.exit(2);
}

const directory = resolve(arguments_[0] ?? join(homedir(), ".local", "bin"));
const marker = "# coding-agent-setup managed launcher";
const commands = ["agent-lint", "agent-format"];

// Quote literal paths for the shell, including spaces and single quotes.
function shellQuote(value: string): string {
  return "'" + value.replaceAll("'", "'\\''") + "'";
}

// Check every destination before updating any launcher.
for (const command of commands) {
  const destination = join(directory, command);

  try {
    if (lstatSync(destination).isSymbolicLink()) {
      throw new Error(`Refusing to replace a symbolic link: ${destination}`);
    }

    const existing = readFileSync(destination, "utf8");

    if (!existing.startsWith(`#!/bin/sh\n${marker}\n`)) {
      throw new Error(`Refusing to replace an unrelated executable: ${destination}`);
    }
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code !== "ENOENT") {
      throw error;
    }
  }
}

mkdirSync(directory, { recursive: true });

for (const command of commands) {
  const destination = join(directory, command);
  const runner = fileURLToPath(new URL(`./${command}.ts`, import.meta.url));

  writeFileSync(
    destination,
    `#!/bin/sh\n${marker}\nexec ${shellQuote(process.execPath)} ${shellQuote(runner)} "$@"\n`,
    { mode: 0o755 },
  );
  chmodSync(destination, 0o755);
  console.log(`Installed ${destination}`);
}

console.log(
  `Keep this checkout and its dependencies. Add ${directory} to PATH, or invoke the absolute launcher paths.`,
);
