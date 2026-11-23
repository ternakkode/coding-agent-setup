---
name: handover
description: Re-explain finished work to the user as a handover published as a Claude artifact; for a pull request, a walkthrough of its code. Use at the end of an implementation session, when opening a pull request, or when asked for a handover, work summary, or PR walkthrough.
---

# Handover

Re-explain what was already done; do not change code.

1. **Write.** Every handover has:
   - **Changes:** every change made, including small ones such as tests and docs.
   - **Verified:** each check that was run and its result.
   - **Remaining:** unfinished work, known limitations, untested paths, deferred or unsupported edge cases, and unresolved proposals.
   - **Decisions:** each choice that shapes the work, in the format below.

   For a pull request, lay these out as [`${CLAUDE_PLUGIN_ROOT}/skills/handover/PR-PAGE.md`](PR-PAGE.md) says. Otherwise explain the work from the final code using [`${CLAUDE_PLUGIN_ROOT}/skills/plan-work/STRUCTURE.md`](../plan-work/STRUCTURE.md) and add the four sections.
2. **Publish.** Always publish the handover as a Claude artifact and share its link. If publishing fails, save it to Git-ignored `tmp/handover-<topic>.md` and say it was not published. The page is private, so never add its link to a pull request.

## Decisions

A decision is a choice a reviewer could want done differently. A pull request description's `## Decisions` section uses the same format:

```markdown
- **<choice>** (implicit) — Why: <reason>. Trade-off: <what it accepts>. Alternatives: <options and why not>.
```

Write "(implicit)" when the choice was made while implementing, without discussion with the user; otherwise name where it was agreed.
