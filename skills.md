# Skills Map

The selected skills and MCP tools for this setup, with their purpose, usage, and installation instructions. This list does not install them. Repository-owned skills live in `skills/`.

| Skill | Purpose | When to use |
|---|---|---|
| [Ponytail](https://github.com/dietrichgebert/ponytail) | Simplify implementation through reuse, standard tools, and only the code needed. | During developer planning, implementation, and review. Keep explanations clear under our communication guide. |
| [Cleanup](skills/cleanup/SKILL.md) | Coordinate six sequential cleanup stages, each in a fresh subagent with an independent assessment. | When asked to clean up a selected branch, feature, or subsystem. Preserve agreed behavior, verify the result, and keep review-only requests read-only. |
| [grill-with-docs](https://www.aihero.dev/skills-grill-with-docs) | Clarify vague requirements through rounds of focused questions and recorded decisions. | Invoke explicitly when the outcome, scope, or important decisions are unclear. Stay within the current decision and stop when the next iteration is clear enough to plan. |
| [retro](https://github.com/mattpocock/skills/blob/main/skills/engineering/retro/SKILL.md) | Find evidence-backed improvements to the agent's shared and project-specific environment. | When a retrospective is explicitly requested. Follow [Improve this setup](improve-this-setup.md) for scope, review criteria, reviewers, and approval. |

- `grill-with-docs` requires the `grilling` and `domain-modeling` skills. Its default outputs include glossary entries and qualifying architecture decisions.
- `retro` requires `writing-for-agents`. Load both installed skills for a requested retrospective; the local workflow and review criteria in [Improve this setup](improve-this-setup.md) take precedence over upstream defaults.
- Apply skills within [Scope of work](scope-of-work.md) and follow [Documentation](documentation.md) for their outputs.
- `cleanup` checks its four companion skills before starting and asks to install any that are missing. Built-in fallback instructions require the user's explicit choice; leftover cleanup is built in. Upstream architecture surveys and whole-codebase rewrites are not part of its default scope.

## Managed Inventory

This inventory is the complete skill set managed by [setup alignment](setup-alignment.md). Every row is required for Codex and Claude Code, including companions. Other installed skills belong to the user and remain untouched. Skill contents include all files in the listed directory, not only `SKILL.md`.

External sources are pinned to full Git commits. Source directories are relative to the named repository:

| Source | Repository | Commit |
|---|---|---|
| Ponytail | [DietrichGebert/ponytail](https://github.com/DietrichGebert/ponytail) | `b088b2df6e08d4306c6a3c3d575fe38c2d2d2989` |
| Matt Pocock | [mattpocock/skills](https://github.com/mattpocock/skills) | `b0618bc436ad893b3c5e84e55fba86586d34a404` |

| Skill | Role | Source | Directory |
|---|---|---|---|
| `cleanup` | Six-stage cleanup workflow | This checkout | `skills/cleanup` |
| `ponytail` | Implementation simplification; cleanup stage 1 | Ponytail | `skills/ponytail` |
| `ponytail-review` | Cleanup stage 2 | Ponytail | `skills/ponytail-review` |
| `codebase-design` | Cleanup stage 3 | Matt Pocock | `skills/engineering/codebase-design` |
| `improve-codebase-architecture` | Cleanup stage 4 | Matt Pocock | `skills/engineering/improve-codebase-architecture` |
| `grill-with-docs` | Requirements clarification | Matt Pocock | `skills/engineering/grill-with-docs` |
| `grilling` | Companion to `grill-with-docs` | Matt Pocock | `skills/productivity/grilling` |
| `domain-modeling` | Companion to `grill-with-docs` | Matt Pocock | `skills/engineering/domain-modeling` |
| `retro` | Setup retrospective | Matt Pocock | `skills/engineering/retro` |
| `writing-for-agents` | Companion to `retro`; agent documentation | Matt Pocock | `skills/productivity/writing-for-agents` |

## Install Skills

Follow [setup alignment](setup-alignment.md) for both initial installation and updates. Use `skills@1.7.1` when invoking the skills CLI; its installation behavior is part of this setup's version policy.

Keep one canonical installation per managed skill under `~/.agents/skills/<name>`. `cleanup` is a symbolic link directly to this checkout's `skills/cleanup` directory. External skills are complete copies from the pinned source directories. Claude Code links to these canonical installations; Codex uses the shared directory. Existing per-agent links for these names must resolve to the same source. Preserve unrelated skills and agent settings.

For a missing or mismatched external skill, obtain the repository at its pinned commit and verify `git rev-parse HEAD` before installation. The skills CLI can install from that local source checkout, selecting only the inventory names with `--skill`, `--global`, `--agent codex claude-code`, and `--yes`. Use its symlink mode, not `--copy`. Verify the installed files afterwards; CLI success or lock metadata alone is insufficient. The disposable source checkout is not the installed skill's link target. The repository pins remain authoritative even if the CLI records that temporary source as a local installation.

Invoke cleanup with `Use $cleanup to clean up this branch while preserving the agreed behavior.` It runs six stages in sequence, ending with coding guide compliance. For findings without edits, ask for a review or dry run. It checks its four companions before starting; fallback guidance requires an explicit choice. Leftover cleanup and coding guide compliance are built in.

## MCP Tools

| Tool | Purpose | When to use |
|---|---|---|
| Context7 | Look up library and framework documentation and examples. | When implementation depends on an unfamiliar or uncertain API. Check the project's installed version and use matching documentation where available; state any version mismatch instead of guessing. |

### Connect Context7

Context7 is required in each target agent's global MCP configuration. Preserve an existing supported transport and authentication method. For a missing connection, use local stdio with `npx -y @upstash/context7-mcp@4.2.0`; supply authentication through the client's existing secure configuration. For an existing stdio connection, use that same exact package version instead of an unversioned package or `@latest`.

An existing hosted connection is also supported: `https://mcp.context7.com/mcp` with API-key authentication or `https://mcp.context7.com/mcp/oauth` with OAuth. The hosted service version is provider-managed; alignment verifies the endpoint, authentication, and tools rather than claiming a pinned server version.

Use the [official client configuration guidance](https://context7.com/docs/resources/all-clients) for configuration syntax. Keep credentials outside this repository and out of output or ordinary backups. Verify `resolve-library-id` and `query-docs` through each agent with a harmless documentation lookup. A configured entry alone does not prove the connection works. Missing credentials, inaccessible services, or an unavailable agent are reported as blocked, while independent alignment steps continue.
