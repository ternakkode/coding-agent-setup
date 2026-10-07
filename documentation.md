# Documentation

- Create documents for a clear audience and purpose. Avoid duplicating information already maintained elsewhere.
- Keep product and feature plans in epics, stories, and tasks as described in [Work planning](work-planning.md), rather than separate specification documents.
- Human handover and review docs are durable. Save them in the project's docs location when requested. Explain outcomes, decisions, and verification through concrete examples; use Mermaid flowcharts, sequence diagrams, and pseudocode where they clarify the flow.
- Writer navigation and planning notes, and AI implementation notes, belong in a Git-ignored `tmp/` folder. Never commit or push them.
- AI notes capture the objective, scope, decisions, relevant files and symbols, verified state, open questions, and next action.
- Keep AI notes concise and current so another session can resume with limited context. Link to source material instead of copying it.
- Separate facts from assumptions. Recheck source code when notes may be stale; never treat a plan as proof of implementation.
