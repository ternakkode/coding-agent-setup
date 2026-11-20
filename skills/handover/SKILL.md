---
name: handover
description: Re-explain finished work to the user as a handover published as a Claude artifact. Use at the end of an implementation session or when asked for a handover or work summary.
---

# Handover

Re-explain what was already done; do not change code.

1. **Write.** Explain the work from the final code using [`${CLAUDE_PLUGIN_ROOT}/skills/plan-work/STRUCTURE.md`](../plan-work/STRUCTURE.md), then add:
   - **Changes:** every change made, including small ones such as tests and docs.
   - **Verified:** each check that was run and its result.
   - **Remaining:** unfinished work, known limitations, and untested paths.
   - **Decisions:** requested work, accepted additions, and unresolved proposals, with their source.
2. **Publish.** Always publish the handover as a Claude artifact and share its link. If publishing fails, save it to Git-ignored `tmp/handover-<topic>.md` and say it was not published.
