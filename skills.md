# Skills Map

The selected skills and MCP tools for this setup, with their purpose, usage, and installation instructions. This list does not install them. Repository-owned skills live in `skills/`.

| Skill | Purpose | When to use |
|---|---|---|
| [Ponytail](https://github.com/dietrichgebert/ponytail) | Simplify implementation through reuse, standard tools, and only the code needed. | During developer planning, implementation, and review. Keep explanations clear under our communication guide. |
| [Cleanup](skills/cleanup/SKILL.md) | Coordinate six sequential cleanup stages, each with its own scope, assessment, and plan. | When asked to clean up a selected branch, feature, or subsystem. Preserve agreed behavior, verify the result, and keep review-only requests read-only. |
| [grill-with-docs](https://www.aihero.dev/skills-grill-with-docs) | Clarify vague requirements through rounds of focused questions and recorded decisions. | Invoke explicitly when the outcome, scope, or important decisions are unclear. Stay within the current decision and stop when the next iteration is clear enough to plan. |
| [retro](https://github.com/mattpocock/skills/blob/main/skills/engineering/retro/SKILL.md) | Find evidence-backed improvements to the agent's shared and project-specific environment. | When a retrospective is explicitly requested. Follow [Improve this setup](improve-this-setup.md) for scope, review criteria, reviewers, and approval. |

- `grill-with-docs` requires the `grilling` and `domain-modeling` skills. Its default outputs include glossary entries and qualifying architecture decisions.
- `retro` requires `writing-for-agents`. Load both installed skills for a requested retrospective; the local workflow and review criteria in [Improve this setup](improve-this-setup.md) take precedence over upstream defaults.
- Apply skills within [Scope of work](scope-of-work.md) and follow [Documentation](documentation.md) for their outputs.
- `cleanup` checks its five companion skills before starting and asks to install any that are missing. Built-in fallback instructions require the user's explicit choice; leftover cleanup is built in. Upstream architecture surveys and whole-codebase rewrites are not part of its default scope.

## Install Skills

Use the [skills CLI](https://github.com/vercel-labs/skills) to install the selected skills for both Codex and Claude Code:

```sh
npx skills add DietrichGebert/ponytail --skill ponytail -g --agent codex claude-code
npx skills add mattpocock/skills --skill grill-with-docs grilling domain-modeling -g --agent codex claude-code
npx skills add mattpocock/skills --skill retro writing-for-agents -g --agent codex claude-code
```

`-g` makes skills available across projects. Choose the symlink installation method so both tools share one canonical copy of each skill. Add agent names such as `cursor` or `opencode` to include more tools, or use `--agent '*'` for all supported targets. Avoid `--all`, which also selects every skill from the source.

`grill-with-docs` needs both listed dependencies. See the [Ponytail source](https://github.com/dietrichgebert/ponytail) and [grill-with-docs guide](https://www.aihero.dev/skills-grill-with-docs).

Install the repository-owned cleanup skill from your local checkout:

```sh
npx skills add /absolute/path/coding-agent-setup --skill cleanup -g --agent codex claude-code
```

Invoke it with `Use $cleanup to clean up this branch while preserving the agreed behavior.` It runs six stages in sequence, ending with leftover removal and verification. For findings without edits, ask for a review or dry run. Before starting, it checks the five companion skills and asks to install any that are missing. You can explicitly choose built-in fallback instructions instead. Leftover cleanup needs no separate installation.

Cleanup uses `ponytail` in ultra mode (source listed above), plus these companion skills. Consult these links when installing a missing companion; use the installed skill by name during cleanup.

| Companion skill | Installation reference |
|---|---|
| `ponytail-review` | [Source](https://github.com/DietrichGebert/ponytail/blob/main/skills/ponytail-review/SKILL.md) |
| `codebase-design` | [Guide](https://www.aihero.dev/skills-codebase-design) |
| `improve-codebase-architecture` | [Guide](https://www.aihero.dev/skills-improve-codebase-architecture) |
| `codebase-simplifier` | [Listing](https://mcpmarket.com/tools/skills/codebase-simplifier) |

## MCP Tools

| Tool | Purpose | When to use |
|---|---|---|
| Context7 | Look up library and framework documentation and examples. | When implementation depends on an unfamiliar or uncertain API. Check the project's installed version and use matching documentation where available; state any version mismatch instead of guessing. |

### Connect Context7

Context7 is an MCP connection, configured separately in each tool. Run its setup once for Codex and once for Claude Code, selecting the relevant tool each time:

```sh
npx ctx7 setup --mcp
```

Follow the authentication and agent-selection prompts. Reuse existing connections and keep credentials outside this repository. For clients not offered by the setup, follow [Context7’s client-specific instructions](https://github.com/upstash/context7/blob/master/docs/resources/all-clients.mdx). See the [Context7 setup CLI](https://github.com/upstash/context7/blob/master/docs/clients/cli.mdx) for supported options.
