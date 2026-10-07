# Skills Map

Skills and MCP tools selected for this setup. This list does not install them.

| Skill | Purpose | When to use |
|---|---|---|
| [Ponytail](https://github.com/dietrichgebert/ponytail) | Simplify implementation through reuse, standard tools, and only the code needed. | During developer planning, implementation, and review. Keep explanations clear under our communication guide. |
| [grill-with-docs](https://www.aihero.dev/skills-grill-with-docs) | Clarify vague requirements through rounds of focused questions and recorded decisions. | Invoke explicitly when the outcome, scope, or important decisions are unclear. Stay within the current hat and stop when the next iteration is clear enough to plan. |

- `grill-with-docs` requires the `grilling` and `domain-modeling` skills. Its default outputs include glossary entries and qualifying architecture decisions.
- For this setup, keep agreed scope and decisions in work items and temporary notes in Git-ignored `tmp/`, following [Documentation](documentation.md). Create durable human documents only when requested.
- Skills support the agreed scope and workflow; they do not authorize extra features, documents, or implementation during discussion.

## MCP Tools

| Tool | Purpose | When to use |
|---|---|---|
| Context7 | Look up library and framework documentation and examples. | When implementation depends on an unfamiliar or uncertain API. Check the project's installed version and use matching documentation where available; state any version mismatch instead of guessing. |
