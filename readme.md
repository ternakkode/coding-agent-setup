# Coding Agent Setup

My Claude Code setup: shared rules in [CLAUDE.md](CLAUDE.md), coding guides, and a Claude Code plugin with the `plan-work` and `handover` skills plus Context7 documentation lookup.

## Set Up a Device

You need Git, Node.js 22.18+ with npm, the GitHub CLI (`gh`), and Claude Code.

```sh
git clone https://github.com/ternakkode/coding-agent-setup.git ~/agents
echo '@~/agents/CLAUDE.md' >> ~/.claude/CLAUDE.md
claude plugin marketplace add ternakkode/coding-agent-setup
claude plugin install coding-agent-setup@coding-agent-setup
gh auth login
```

The import line makes Claude Code load the rules in every project. The plugin provides the skills and Context7. For the lint fallback tools and checks, ask Claude: **"Align this device with this repository."** It follows [setup alignment](setup-alignment.md). To update, ask: **"Pull the latest setup and align this device."**
