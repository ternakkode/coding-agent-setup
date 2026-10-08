# Device Oxlint and Oxfmt Checks

`agent-lint` checks JavaScript and TypeScript using this checkout's spacing, complexity, and TypeScript contract rules. It runs its own pinned Oxlint with an explicit config, regardless of the project's linter. The tooling and configuration are written in TypeScript; Node 22.18+ (22.x) or 24+ runs them directly.

`agent-format` adds pinned Oxfmt with the same device-config priority. It checks formatting by default; `--write` formats files. Oxfmt handles indentation, quotes, line wrapping, and other formatting; Oxlint adds the required blank lines between logical steps.

## Install on a device

From this checkout:

```sh
npm --prefix linting/oxlint ci
npm --prefix linting/oxlint run install:device
```

The installer creates `~/.local/bin/agent-lint` and `~/.local/bin/agent-format`, pointing to this checkout and the Node executable used to install it. Add `~/.local/bin` to your shell's PATH, or use the full executable paths. It checks both destinations before updating either, and refuses unrelated executables or symbolic links. A different destination can be passed with `npm run install:device -- /absolute/bin/directory` from `linting/oxlint`.

Keep this checkout and its dependencies. After pulling updates, run `npm ci` and the installer again; rerun the installer after changing your Node installation or moving the checkout. Remove the generated launchers to uninstall.

## Use in any project

Agents run the setup-owned tools externally. Resolve this setup checkout from the shared instructions and the target project from the task; use absolute paths. Run from the target project so its ignore paths resolve consistently. Keep device commands and paths out of project scripts, dependencies, hooks, CI, and startup instructions; retain the project's own checks.

```sh
agent_setup_checkout="/absolute/path/coding-agent-setup"
agent_target_project="/absolute/path/project"
cd "$agent_target_project"
node "$agent_setup_checkout/linting/oxlint/bin/agent-format.ts" --write "$agent_target_project"
node "$agent_setup_checkout/linting/oxlint/bin/agent-lint.ts" --fix "$agent_target_project"
node "$agent_setup_checkout/linting/oxlint/bin/agent-format.ts" "$agent_target_project"
node "$agent_setup_checkout/linting/oxlint/bin/agent-lint.ts" "$agent_target_project"
```

For read-only verification, run just the last two commands. Select narrower absolute source paths when needed. Tool dependencies belong in the setup checkout; installed launchers can replace the `node` commands.

Use `bin/agent-format.ts` the same way for formatting. Its explicit [TypeScript configuration](https://oxc.rs/docs/guide/usage/formatter/config) sets two-space indentation, double quotes, semicolons, a 100-column print width, LF endings, and a final newline. Import and package-key sorting are disabled. Project formatter configs and `.editorconfig` cannot override these configured values. The shared `.formatignore` excludes dependencies, generated outputs, and npm lockfiles; project `.prettierignore` and `.gitignore` are not used by this command. Choose source paths when a project has additional generated or sensitive-to-formatting files. Oxfmt supports additional file formats; the commands above deliberately target source code.

The command:

- Resolves Oxlint and its plugin from this setup, rather than the project's dependencies or PATH.
- Passes the setup config explicitly and disables nested config discovery.
- Ignores project `.eslintignore` files and CLI suppression/config overrides. ESLint disable comments do not affect this check.
- Excludes dependency and generated-output directories (`node_modules`, `dist`, `build`, `coverage`) through the shared config. Other generated directories require an agreed shared-config change or narrower input paths.
- Respects `.gitignore` during directory scanning. Pass an ignored source file explicitly when it needs checking; `.gitignore` does not weaken the rules applied to selected files.
- Exits unsuccessfully for spacing violations, parsing/config errors, or unmatched input. `--fix` applies whitespace fixes, then reports remaining errors.

Oxlint supports `.js`, `.jsx`, `.mjs`, `.cjs`, `.ts`, `.tsx`, `.mts`, and `.cts`. It does not lint Go or other languages. This check does not type-check a project or replace its correctness checks.

## Enforce alongside project checks

Priority means the project cannot weaken the device configs: project checks, Oxfmt, and Oxlint must pass. Run project formatting first, then device formatting and spacing fixes, then check both. Oxfmt preserves the blank lines inserted by the spacing rules; it does not infer missing business-step boundaries.

If a project style rule conflicts with the device conventions, align that style rule with the shared policy while keeping its correctness checks.

The agent must pass these external checks before completion and report unavailable tooling or failed checks. This workflow does not install project hooks or CI and does not run automatically on every edit. Native `oxlint-disable` comments remain supported; review scoped suppressions.

## Spacing conventions

Keep imports and related ordinary declarations grouped. Add a blank line after the import group, before return/control flow, after block statements and `if` guards, and before declarations initialized with `map`, `filter`, `flatMap`, `reduce`, `sort`, or `toSorted`. Remove trailing spaces, repeated empty lines, and missing final newlines.

Separate consecutive schema declarations using `pipe`, `strictObject`, `object`, `array`, `union`, or `picklist`. Keep a `safeParse` result and its immediate `if (!result.success) throw ...` guard together.

```ts
const allocatedCents = allocations.reduce((total, item) => total + item.notionalCents, 0);
const remainingCents = budgetCents - allocatedCents;

const ranked = [...allocations].sort(compareRemainders);

for (let index = 0; index < remainingCents; index += 1) {
  ranked[index].notionalCents += 1;
}
```

These are deterministic syntax conventions. Deciding whether other statements form separate business steps remains a code-review responsibility.

The spacing rules use `@stylistic/eslint-plugin` through [Oxlint's compatible plugin API](https://oxc.rs/docs/guide/usage/linter/js-plugins), not the ESLint runner. That API is currently alpha, so dependencies are pinned and exercised by regression tests. npm may install ESLint as the plugin's peer dependency; the device command always runs Oxlint. [Explicit configuration](https://oxc.rs/docs/guide/usage/linter/config) prevents project config discovery.

## Function complexity

Oxlint checks `eslint/complexity`, `eslint/max-depth`, and `eslint/max-lines-per-function`; thresholds live in [the config](oxlint.config.ts). Function length excludes blank lines and comments. Split along real responsibilities; use a justified, scoped suppression when extraction would only add indirection. These checks cannot establish validation ownership or the accuracy of error messages; follow the [contracts rule](../../coding/code-quality.md#contracts-and-validation).

## TypeScript contracts

These checks apply to `.ts`, `.tsx`, `.mts`, and `.cts`; JavaScript keeps the spacing checks:

| Rule | Enforced syntax |
|---|---|
| `typescript/no-explicit-any` | Reject explicit `any` instead of disguising missing contracts. |
| `coding-agent/no-unknown` | Reject explicit `unknown` outside input-boundary files or catch parameters. |
| `coding-agent/named-function-contracts` | Reject anonymous object types in function parameter and return annotations, including arrows, methods, and function types. |
| `coding-agent/explicit-export-return` | Require return annotations on directly exported function declarations. |
| `coding-agent/named-domain-values` | Require named values for string literals assigned to or compared directly with `status`/`role`, and string returns from functions with a named `*Status` return type. |

Unknown input is allowed in `*.boundary.ts` (also TSX/MTS/CTS) or a `boundaries/` folder. Use these for actual decoders, not typed business workflows. If a project already has a different decoder convention, add its paths to the shared config exception. Explicit `unknown` on a catch parameter is valid because thrown values are not guaranteed to be errors. `any` remains prohibited at boundaries.

Named contracts and shared status/role constants are checked syntactically through the small local [plugin](contracts.ts), using [Oxlint's plugin API](https://oxc.rs/docs/guide/usage/linter/writing-js-plugins). The rules report decisions without autofixing types or inventing constants. Keep `strict` TypeScript checking enabled in the consuming project; lint does not replace the compiler.

Lint cannot determine whether a check represents a real business requirement, whether two named types duplicate the same contract, or whether a boundary actually decodes external data. It also does not cover every indirect export or domain-value expression. Those decisions follow the concise [contracts and validation rule](../../coding/code-quality.md#contracts-and-validation). In particular, do not remove positivity, integer precision, authorization, or funds checks merely because a value has a primitive type.

## Verify changes

From this checkout:

```sh
npm --prefix linting/oxlint test
npm --prefix linting/oxlint run typecheck
npm --prefix linting/oxlint run format:check
npm --prefix linting/oxlint run lint
```
