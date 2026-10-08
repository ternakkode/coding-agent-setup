import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";

const arguments_ = process.argv.slice(2);

if (arguments_.includes("--help")) {
  console.log(
    "Usage: agent-format [--write] [file-or-directory ...]\nChecks formatting with device Oxfmt rules. Use --write to format files. Defaults to the current directory.",
  );
  process.exit(0);
}

const unsupported = arguments_.find(
  (argument) => argument.startsWith("-") && argument !== "--write",
);

if (unsupported) {
  console.error(`Unsupported option: ${unsupported}. Use --write or file/directory paths.`);
  process.exit(2);
}

const paths = arguments_.filter((argument) => argument !== "--write");
const config = fileURLToPath(new URL("../oxfmt.config.ts", import.meta.url));
const ignore = fileURLToPath(new URL("../.formatignore", import.meta.url));
const cli = fileURLToPath(new URL("../bin/oxfmt", import.meta.resolve("oxfmt")));
const options = [
  "--config",
  config,
  "--disable-nested-config",
  "--ignore-path",
  ignore,
  arguments_.includes("--write") ? "--write" : "--check",
];
const result = spawnSync(process.execPath, [cli, ...options, ...(paths.length ? paths : ["."])], {
  stdio: "inherit",
});

if (result.error) {
  console.error(result.error.message);
}

process.exit(result.status ?? 1);
