import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";

const arguments_ = process.argv.slice(2);

if (arguments_.includes("--help")) {
  console.log(
    "Usage: agent-lint [--fix] [file-or-directory ...]\nChecks JavaScript and TypeScript using this device's spacing, complexity, and contract rules. Defaults to the current directory.",
  );
  process.exit(0);
}

const unsupported = arguments_.find((argument) => argument.startsWith("-") && argument !== "--fix");

if (unsupported) {
  console.error(`Unsupported option: ${unsupported}. Use --fix or file/directory paths.`);
  process.exit(2);
}

const paths = arguments_.filter((argument) => argument !== "--fix");
const config = fileURLToPath(new URL("../oxlint.config.ts", import.meta.url));
const cli = fileURLToPath(new URL("../bin/oxlint", import.meta.resolve("oxlint")));
const options = [
  "--config",
  config,
  "--disable-nested-config",
  "--no-ignore",
  "--max-warnings",
  "0",
];

if (arguments_.includes("--fix")) {
  options.push("--fix");
}

const result = spawnSync(process.execPath, [cli, ...options, ...(paths.length ? paths : ["."])], {
  stdio: "inherit",
});

if (result.error) {
  console.error(result.error.message);
}

process.exit(result.status ?? 1);
