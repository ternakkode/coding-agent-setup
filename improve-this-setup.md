# Improve This Setup

Invite brief feedback at meaningful checkpoints when useful, not after minor edits. Keep the user's feedback separate from your proposals.

Propose improvements from specific incidents: explain the impact, why the setup was insufficient, the exact change, and how to verify its benefit. Prefer repairing existing mechanisms over adding duplicates. Get approval before changing the setup or opening issues for your proposals. No change is a valid result.

## Scope and Criteria

Review shared and project-specific `AGENTS.md`, `CLAUDE.md`, linked guides, skills, tools, and checks. Keep proposals separate by scope; project-specific needs belong in the project, and global changes need evidence of broader applicability.

Before a retrospective, ensure `retro` and `writing-for-agents` are available to both Codex and Claude Code reviewers. Install missing skills using the [skills catalog](skills.md), verify they can be loaded, and give both reviewers their instructions. Apply these local overrides:

- Categories are prompts, not quotas; missing guardrails alone do not justify new ones.
- Check existing mechanisms first. Keep relevant standards available during implementation and review.
- An instruction being unused in one session is not sufficient evidence for deletion.

## Full Retrospective — When Requested

Only when explicitly requested:

1. Save the available conversation and relevant tool results, in order and with secrets redacted, to a `.txt` file in Git-ignored `tmp/`. Disclose missing coverage.
2. Collect committed, staged, unstaged, and new-file changes against the session's starting state in `tmp/`. Label uncertain attribution when the baseline is unavailable.
3. Use two fresh independent reviewers: Sol in Codex and Opus in Claude Code. Resolve available model identifiers; disclose unavailable models or incomplete inputs without silently substituting or claiming a complete review. Give both the transcript, changes, applicable shared and project rules, and the skills and local criteria above. Reviewers report findings without edits or issues.
4. Reconcile findings into concise proposals for approval. Neither reviewers nor the final report trigger another retrospective.

## User Feedback

When the user provides feedback, create an issue with `gh issue create --repo ternakkode/coding-agent-setup --body-file <file>` and share its link. Include the feedback, workflow context, and suggested rule changes without secrets or private project details. Do not invent feedback or create an issue when the user skips the request.
