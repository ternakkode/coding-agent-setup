# Coding Agent Setup

My coding agent setup: shared instructions, Markdown style guides, skills, and custom scripts.

This repository keeps the setup in one place so I can track changes and reuse it across projects and devices.

See [AGENTS.md](AGENTS.md) for the guides and [skills and MCP catalog](skills.md) for the selected tools and their setup.

## Set Up a Device

Keep one checkout of these guides and point your coding tools to it. The steps below cover Codex and Claude Code; other tools can use the same source through their own instruction settings. Have Git, Node.js/npm, GitHub CLI (`gh`), and your chosen coding tools installed. Shell examples use macOS/Linux or WSL.

### 1. Download the guides

```sh
mkdir -p "$HOME/.agents"
git clone https://github.com/ternakkode/coding-agent-setup.git "$HOME/.agents/coding-agent-setup"
```

If you already have a checkout, use its location in the next step instead.

### 2. Connect global instructions

Add the same instruction to both `~/.codex/AGENTS.md` and `~/.claude/CLAUDE.md`, replacing `/absolute/path` with the full checkout path:

```text
Read and follow /absolute/path/coding-agent-setup/AGENTS.md and its linked guides.
Resolve links relative to that checkout, not the current project.
```

Both files are small pointers; the rules stay in this repository. For example, on this device both would point to `/Users/ternakkode/.agents/coding-agent-setup/AGENTS.md` after the clone above.

For additional tools, use the same pointer in their global instructions:

| Agent | Global instructions |
|---|---|
| [Claude Code](https://code.claude.com/docs/en/memory) | `~/.claude/CLAUDE.md` |
| [Codex](https://developers.openai.com/codex/guides/agents-md/) | `~/.codex/AGENTS.md` |
| [OpenCode](https://opencode.ai/docs/rules/) | `~/.config/opencode/AGENTS.md` |
| Other agents | Use the agent’s documented global instructions or user-rules setting. |

Keep existing instructions and reconcile conflicting older rules. Keep the whole checkout together so its relative links work. These guides are ordinary Markdown, not installable `SKILL.md` packages; the skills CLI does not wire them into global instructions.

Codex uses `~/.codex` by default, or your custom `CODEX_HOME`. A global `AGENTS.override.md` takes precedence over `AGENTS.md`; if present, add the instruction there instead. See [official instruction discovery rules](https://developers.openai.com/codex/guides/agents-md/).

### 3. Configure skills and MCP tools

Follow the [skills and MCP catalog](skills.md) for the selected tools, when to use them, dependencies, and installation instructions. Keep that file as the single list for this setup.

### 4. Enable feedback and verify

```sh
gh auth login
gh auth status
npx skills ls -g
```

GitHub access lets the agent file your feedback in this repository. Start fresh Codex and Claude Code sessions in another project. Ask both to report the absolute path of the shared `AGENTS.md` they read, summarize its guides, confirm the skills listed in the [catalog](skills.md) are available, and exercise the configured MCP connections. Both should report the same checkout path. Use each tool’s MCP settings or status command to inspect the connection; a listed connection alone does not prove the lookup works.

## Update the Guides

```sh
git -C "$HOME/.agents/coding-agent-setup" pull --ff-only
```

Use your checkout path if different. One pull updates the guide and owned-skill source. After pulling, rerun the owned skill's local installation command from the [catalog](skills.md#install-skills) to refresh its installed copy, then start new sessions. Skills and MCP packages from other sources are installed separately.

Update installed skills separately when needed:

```sh
npx skills update -g
```
