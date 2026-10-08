# Align a Device with This Repository

Use this procedure when asked to install, update, repair, or align the local coding-agent setup. It is an ordered procedure for the agent to execute using existing tools. Its desired state comes from this checkout and the [managed inventory](skills.md#managed-inventory).

An alignment request authorizes routine repairs of the listed components, including installation of missing skills and replacement of stale managed copies after backup. Follow the steps in order; continue independent components when one is blocked. Check-only requests run inspection and verification without repairs.

## Scope and Version Policy

- Target Codex and Claude Code by default; use a narrower target when explicitly requested. An unavailable target is blocked, not silently omitted. Installing or upgrading the agent applications themselves is outside this procedure.
- Use the current checkout, including user-approved local edits. Pull only when requested, using `git pull --ff-only` on a clean checkout. Preserve dirty or diverged checkouts and report the pull as blocked.
- Manage only the instruction pointers, inventory skills and their links, device lint tooling, and Context7 connection. Preserve other skills, plugins, hooks, MCP servers, and settings. An upstream-deleted skill outside the inventory is still unrelated local state.
- Alignment uses the inventory's external pins; it does not resolve `latest`, run a blanket skill update, edit pins, commit, or push. An explicit upstream-upgrade request follows [Upgrading upstream sources](#upgrading-upstream-sources).
- Already matching components stay unchanged. Create backups only before repairs, outside the checkout under `~/.agents/setup-backups/<unique-run>/`. Preserve directory contents and symbolic-link targets. Use secure client-managed backup facilities for credential-bearing configuration; ordinary backups and reports contain no credentials.

## 1. Resolve the Target and Inspect

Resolve the absolute setup checkout from the user's request or global instructions, not the current project. Confirm it contains `AGENTS.md`, this procedure, `skills.md`, and `linting/oxlint/package-lock.json`. If pointers identify different checkouts and no authoritative checkout is supplied, ask which one to use before changing them.

Record the checkout path and revision, selected agents, effective instruction files, skill directories, Node executable/version, and existing managed launchers and MCP connections. Honor client home overrides such as `CODEX_HOME` and `CLAUDE_CONFIG_DIR`; if discovery locations differ from the defaults below, verify the installed client's documented locations before making links.

Read the inventory and classify every managed component as matching, missing, mismatched, or blocked. Inspect file contents and resolved link destinations, not only names, timestamps, or skill-lock metadata. Record unrelated conflicts separately. This comparison is the repair list; every change in later steps must correspond to it.

**Done when:** all managed components have an expected state, an observed state, and a proposed repair or a specific blocker. Report the target and repair summary before applying changes.

## 2. Reconcile Global Instructions

Use the effective global instruction file: Codex's `AGENTS.override.md` when present, otherwise `AGENTS.md`, under its configured home; Claude Code's `CLAUDE.md` under its configured home. The default homes are `~/.codex` and `~/.claude`.

Ensure each effective file contains one setup pointer with these instructions, substituting the resolved checkout path:

> Read and follow /absolute/path/coding-agent-setup/AGENTS.md and its linked guides.
> Resolve links relative to that checkout, not the current project.

Keep unrelated instructions. Replace an older pointer to this setup; do not append a second conflicting pointer. If unrelated instructions contradict the setup and their authority is unclear, report that component as blocked rather than erasing them. Resolve each guide link from the checkout and confirm its file and any linked heading exist.

**Done when:** both effective global files route to the same selected checkout and its guide links resolve. File inspection verifies configuration; it does not prove an already-running session has reloaded it.

## 3. Reconcile Every Inventory Skill

Process all skill rows, including companions. The default canonical directory is `~/.agents/skills/<name>`; Claude Code's per-agent link is `~/.claude/skills/<name>`. Codex discovers the shared directory, so a missing `~/.codex/skills/<name>` link is not itself a failure. Inspect existing per-agent installations for managed names and make their resolved source agree with the canonical installation.

For repository-owned skills, link the canonical installation directly to the inventory directory in the selected setup checkout. Back up a stale copy, incorrect link, or broken link before replacing it. Verify the final resolved directory equals the checkout's source directory. This keeps owned skills current when the checkout changes.

For external skills, fetch each inventory repository into Git-ignored `tmp/`, check out its exact pinned commit, and confirm the full `git rev-parse HEAD` value. Verify all listed skill directories and their `SKILL.md` files exist. A missing source, inaccessible commit, or missing directory blocks its affected skills; do not substitute another revision or renamed skill.

Compare the complete installed directory with the pinned source, including relative file names and bytes. If they match, leave the installation untouched. Otherwise back it up and install only the affected inventory names using the [pinned skills CLI](skills.md#install-skills) from that verified local source checkout. The installed external skills are copies; they must survive deletion of the temporary fetch directory. Back up the CLI's skill-lock file before an installation that changes it. Recompare installed contents afterwards.

Use links from Claude's skill directory to the canonical installations. Replace duplicate managed copies or wrong links after backup; preserve unrelated names. If an unrelated plugin also provides a managed skill name, report the duplicate and block discovery verification for that skill until its authority is resolved. Do not disable the whole plugin as a routine repair.

**Done when:** every inventory skill has the correct complete contents or owned-source link, all selected agents discover the same canonical installation, and no managed link is broken or points into `tmp/`. List unavailable companions individually. A CLI installation message alone is not sufficient evidence.

## 4. Reconcile Device Formatting and Lint

Use `linting/oxlint/package.json` for runtime requirements and `package-lock.json` for dependency versions. Check installed dependency presence and versions against the lockfile, allowing platform-inapplicable optional dependencies. A matching installation stays untouched; otherwise run `npm --prefix <absolute-checkout>/linting/oxlint ci`. An unsupported Node runtime blocks tooling alignment; do not silently upgrade system Node.

The default launcher directory is `~/.local/bin`. Retain an explicitly configured alternate directory. Both managed launchers must be executable and invoke the selected Node executable and this checkout's respective `bin/agent-format.ts` and `bin/agent-lint.ts` runners. Compare those paths and the launcher's managed marker before deciding to reinstall. Treat the launcher pair as one repair: if either is missing or stale, the existing `install:device` command refreshes both after checking both destinations. Use the selected destination, following [device installation](linting/oxlint/README.md#install-on-a-device). When both match, skip installation. Respect its refusal to replace unrelated executables or symbolic links; report that conflict instead of bypassing it.

Run each launcher from outside the setup checkout with `--help`. Check command discovery points to the expected launchers; an absolute-path smoke check alone does not prove PATH alignment. Preserve existing shell configuration when adding a missing launcher directory to the user's documented PATH mechanism. If that mechanism cannot be established, report PATH as blocked and give the working absolute commands.

Run the tooling's [verification commands](linting/oxlint/README.md#verify-changes). Use absolute source paths for device formatting/lint verification. For this alignment, checks are read-only: failures do not authorize unrelated code formatting or changes to the rules. Keep device tools out of other projects' dependencies, scripts, hooks, and CI.

**Done when:** dependencies match the lockfile, both launchers resolve correctly and run outside the checkout, command discovery works, and tests, typecheck, source formatting, and lint pass. Record failures individually.

## 5. Reconcile Context7 for Each Agent

Inspect each selected agent's effective global MCP configuration without printing secrets. Apply the [inventory's Context7 policy](skills.md#connect-context7): preserve supported transport and authentication, pin local stdio packages, and add a missing connection through the client's supported configuration mechanism. Retain unrelated fields and servers; avoid duplicate Context7 registrations. Missing credentials or interactive authentication are blockers requiring user input, not permission to invent credentials or reset the configuration.

For each agent, discover the connection's tools, resolve the library ID for Node.js, and query documentation for reading a UTF-8 file. Verify both tools return relevant results. A listed connection, an HTTP reachability check, or a successful call through the other agent does not verify this agent's connection. If the client is unavailable or configuration reload is required, record runtime verification as blocked and continue the remaining checks.

**Done when:** each agent has a policy-matching connection and successful resolution and documentation-query evidence. The hosted service remains provider-managed; its version is not reproducible from this repo.

## 6. Verify Completion and Repeatability

Repeat the comparison from step 1 against every managed component. An aligned setup produces an empty repair list; leave its files, links, installations, and configuration unchanged. Temporary fetches and read-only verification do not count as setup repairs. If further repairs remain, complete them and recheck instead of declaring success.

When fresh agent sessions can be run, verify in a project outside the checkout that each reports this setup's absolute instruction path, discovers every inventory skill, and exercises Context7. When they cannot be run, report that fresh-session verification remains blocked; do not equate filesystem inspection with loaded-session behavior.

Report one row per managed component, splitting evidence by agent when needed: global instruction pointer, each inventory skill, lint dependencies, each launcher and PATH, and each Context7 connection. Use **aligned**, **changed and verified**, or **blocked**, with concrete evidence or the blocker. Include checkout revision, repairs, backup location if any, and remaining fresh-session checks. Overall completion requires no blocked managed components. Keep unrelated findings separate.

**Done when:** every managed row is accounted for, the repeated comparison requires no further repairs, and verification limitations are explicit. Do not say “everything is updated” when required evidence is missing.

## Upgrading Upstream Sources

Only on an explicit upstream-upgrade request, inspect newer revisions for the inventory's external sources. Review changed skill files, companions, source paths, and names; preserve the inventory's agreed scope. Update full commit pins and any explicitly requested CLI or MCP package pins, then align against those new values. Fetch failures and upstream deletions require a reported blocker or an agreed replacement, not a fallback to `latest`. Report the before/after revisions and verification. Committing or publishing the changes follows the user's separate authorization.
