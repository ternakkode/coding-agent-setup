# Improve This Setup

At meaningful checkpoints, invite brief feedback when useful: what worked, what was confusing or unnecessary, and what should change. Do not ask after every minor edit. Mention concrete setup improvements separately from the user's feedback.

Propose rule changes only from evidence in the work. Name the target file, suggest exact wording, and explain the benefit. Prefer adjusting existing rules over adding duplicates. Get approval before changing rules or creating issues for your own proposals; no proposed change is a valid result.

## Full Retrospective — When Requested

Run the full conversation-and-diff review only when explicitly requested:

1. Save the available conversation and relevant tool results in a `.txt` file in Git-ignored `tmp/`. Preserve message order and redact secrets. Disclose missing coverage rather than reconstructing it as fact.
2. Collect committed, staged, unstaged, and new-file changes against the session's starting state. Label uncertain attribution if that baseline is unavailable. Keep review inputs in `tmp/`.
3. Use two fresh independent reviewers: one Sol subagent in Codex and one Opus subagent in Claude Code. Resolve available model identifiers. Give both the transcript, all changes, and relevant rules. They report findings without editing or opening issues. Disclose unavailable models or incomplete input; do not silently substitute or claim a complete review.
4. Reconcile findings into a short set of evidence-backed proposals for approval. Reviewers do not run their own closeout reviews, and reporting the result does not trigger another review.

## User Feedback

When the user provides feedback, create an issue in `ternakkode/coding-agent-setup` using `gh issue create --repo ternakkode/coding-agent-setup`. Summarize the feedback, relevant workflow context, and suggested rule changes without secrets or private project details. Use `--body-file` and share the issue link. Do not invent feedback or create an issue if the user skips the request.
