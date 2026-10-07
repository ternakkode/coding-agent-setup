# Code Quality

- Make the main business flow easy to understand.
- Choose the simplest complete implementation for the agreed scope.
- Keep business rules consistent and avoid duplicating them.
- Before adding code, search the entire codebase for existing implementations and duplication. Reuse or adjust existing code where it fits, extending it as needed within the agreed scope while preserving existing callers' behavior.
- Make changes easy to verify and keep their effects predictable.
- Fix root causes and preserve behavior outside the requested change.
