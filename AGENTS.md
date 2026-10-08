# Agent Instructions

State the outcome, constraints, and evidence needed. Let the agent choose routine methods; scale planning and detail to uncertainty and impact. Explicit user preferences and requested workflows remain requirements.

Resolve guide links relative to this setup checkout, including when working in another project.

## Core Rules

- Discussion and review remain read-only unless implementation is requested. Complete authorized work independently.
- Preserve agreed behavior and scope. Present meaningful additions and material decisions outside that agreement as proposals, including effects on compatibility, cost, or data safety; establish agreement before including them. Report unrelated findings separately.
- Follow repository conventions and make the smallest sufficient change. Verify the outcome with relevant checks.
- Keep business flows readable, group related responsibilities, and use explicit contracts. Follow the code quality and architecture guides for validation ownership, meaningful absence, and responsibility boundaries.
- For JavaScript or TypeScript changes, follow the [setup-owned Oxfmt and Oxlint workflow](linting/oxlint/README.md#use-in-any-project) against absolute target source paths, alongside project checks. Apply project formatting, then device formatting and spacing fixes; all checks must pass before completion. Report unavailable tooling or failed checks. Keep device tooling out of generated project scripts, dependencies, hooks, and CI.
- Preserve material decisions and their source in plans and handoffs, distinguishing requested work, accepted additions, and unresolved proposals. Keep working notes and pseudocode sketches in Git-ignored `tmp/`.
- Communicate clearly and concisely. Report changes, verification, and meaningful limitations; distinguish evidence from assumptions.
- Do not change these setup rules without approval.

## Guides

Read the applicable guides before implementation or review; consult examples when the task shape needs clarification:

| Guide | When to read |
|---|---|
| [Communication style](communication-style.md) | Explaining decisions, results, or unfamiliar concepts. |
| [Scope of work](scope-of-work.md) | Resolving scope, behavior, or authorization decisions. |
| [Work planning](work-planning.md) | Planning uncertain or coordinated work, preserving decisions in handoffs, or delegating. |
| [Documentation](documentation.md) | Creating documents, plans, or handover notes. |
| [Setup alignment](setup-alignment.md) | Installing, updating, repairing, or checking this device against the repo; includes requests to update everything in the local setup. |
| [Skills and MCP catalog](skills.md) | Selecting a skill or tool, including the cleanup workflow; read installation sections only for setup. |
| [Code quality](coding/code-quality.md) | Writing, refactoring, or reviewing code; covers contracts, validation, pseudocode, and worked examples. |
| [Architecture](coding/architecture.md) | Writing, refactoring, or reviewing responsibilities, interfaces, or dependencies; covers cohesion, coupling, and script flows. |
| [Device formatting and lint](linting/oxlint/README.md) | Changing JavaScript or TypeScript, or reviewing formatting, spacing, complexity, or TypeScript contracts; read installation steps only for device setup. |
| [Data design](coding/data-design.md) | Changing API contracts, schemas, or data handling. |
| [Testing](coding/testing.md) | Choosing or updating verification. |
| [Improve this setup](improve-this-setup.md) | Handling feedback, proposing rule changes, or running a requested retrospective. |
