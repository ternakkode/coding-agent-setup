# Improve This Setup

Propose setup changes only from specific incidents: the impact, why the setup fell short, the exact change, and how to verify it. Prefer repairing an existing rule over adding one; no change is a valid result. Get approval before changing the setup.

## User Feedback

When the user gives setup feedback, file it with `gh issue create --repo ternakkode/coding-agent-setup --body-file <file>` and share the link. Include the feedback, workflow context, and suggested rule changes, without secrets or private project details.

## Retrospective (only when requested)

1. Save the conversation and relevant tool results, secrets redacted, plus the session's code changes, to Git-ignored `tmp/`.
2. Run two fresh, independent reviewer subagents, one on Fable 5.2 and one on Opus 5.5, each with the saved material and the applicable rules. Reviewers report findings without edits. A rule unused in one session is not evidence for deleting it.
3. Reconcile the findings into short proposals for approval.
