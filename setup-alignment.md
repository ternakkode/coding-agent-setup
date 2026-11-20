# Align a Device

Use when asked to install, update, or check this setup. A check-only request changes nothing. Report each step as **aligned**, **changed**, or **blocked**, with evidence.

1. **Checkout.** Use `~/agents` unless the user names another checkout. Pull only on request, with `git pull --ff-only` on a clean checkout; report a dirty or diverged checkout as blocked.
2. **Rules.** `~/.claude/CLAUDE.md` contains one line importing this setup, `@<checkout>/CLAUDE.md`. Keep its other content and replace any older pointer to this setup.
3. **Plugin.** Install it, or on update refresh the marketplace first:
   ```sh
   claude plugin marketplace add ternakkode/coding-agent-setup
   claude plugin install coding-agent-setup@coding-agent-setup
   claude plugin marketplace update coding-agent-setup && claude plugin update coding-agent-setup@coding-agent-setup
   ```
   Then back up to `~/.agents/setup-backups/<run>/` and remove the skills this setup used to install from `~/.claude/skills/` and `~/.agents/skills/`: `cleanup`, `plan-work`, `handover`, `ponytail`, `ponytail-review`, `codebase-design`, `improve-codebase-architecture`, `grill-with-docs`, `grilling`, `domain-modeling`, `retro`, and `writing-for-agents`. The plugin then provides `plan-work` and `handover`. Leave other skills alone. Report any other Context7 server registration as a duplicate; do not remove it.
4. **Lint fallback.** Unless both launchers in `~/.local/bin` already point at this checkout, run `npm --prefix <checkout>/linting/oxlint ci` and `npm --prefix <checkout>/linting/oxlint run install:device`. Make sure `~/.local/bin` is on `PATH`. Do not upgrade the system Node.
5. **Verify** in a fresh session in another project: `/memory` shows the imported rules, the plugin's skills are listed, Context7 resolves a library and returns its docs, and `agent-lint --help` runs. If a fresh session cannot be run, report that check as blocked.
