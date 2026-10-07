# Testing

- Choose tests from important user outcomes: the main journey first, then likely or high-impact failures.
- Test observable behavior rather than implementation details. Update obsolete expectations when requirements change, preserving checks for behavior users still rely on.
- Keep tests small and fast. Use the lowest-cost level that proves the outcome, with end-to-end checks for critical journeys; avoid redundant coverage.
- Use Given–When–Then consistently: starting conditions, action, observable result. Follow existing naming, setup, and assertion conventions.
- Run relevant checks and investigate failures independently. Follow [Scope of work](../scope-of-work.md) when a fix would change behavior or expand scope.
