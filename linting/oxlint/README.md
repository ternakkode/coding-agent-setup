# Device Oxlint and Oxfmt Checks

A fallback for JavaScript and TypeScript projects that define no linter or no formatter of their own. When the project has a linter (ESLint, Biome, or Oxlint config, or a `lint` script), use it and skip `agent-lint`; when it has a formatter (Prettier, Biome, or Oxfmt config, or a `format` script), use it and skip `agent-format`. Project checks take precedence; do not change project style rules to match these.

`agent-lint` runs pinned Oxlint with this checkout's spacing, complexity, and TypeScript contract rules. `agent-format` runs pinned Oxfmt (two-space indent, double quotes, semicolons, 100 columns, LF, final newline). Both use explicit configs that project configs cannot override, and need Node 22.18+ (22.x) or 24+.

## Install on a device

```sh
npm --prefix linting/oxlint ci
npm --prefix linting/oxlint run install:device
```

This creates `~/.local/bin/agent-lint` and `~/.local/bin/agent-format`, pointing at this checkout and the current Node. Pass another directory with `npm run install:device -- /absolute/bin/dir` from `linting/oxlint`. The installer refuses to replace unrelated files. Rerun both commands after pulling updates, changing Node, or moving the checkout; delete the launchers to uninstall.

## Use in any project

Run from the target project with absolute paths, formatting first:

```sh
cd /absolute/path/project
agent-format --write /absolute/path/project
agent-lint --fix /absolute/path/project
agent-format /absolute/path/project
agent-lint /absolute/path/project
```

For read-only checks, run only the last two. Pass narrower source paths when needed. Without the launchers, use `node <checkout>/linting/oxlint/bin/agent-format.ts` and `bin/agent-lint.ts`. Dependencies, `dist`, `build`, and `coverage` are excluded, and `.gitignore` is respected when scanning directories. The checks do not type-check or replace project tests. Scoped `oxlint-disable` comments are allowed; review them.

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
