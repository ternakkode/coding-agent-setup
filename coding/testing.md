# Testing

- Before writing tests, identify the user outcomes that matter and the failures that would harm them.
- Choose cases from the agreed behavior. Cover the main journey first, then likely or high-impact failures.
- Test observable results, not implementation details. Tests should survive refactors that preserve behavior.
- When requirements change, update or remove tests for obsolete behavior. Preserve checks for behavior users still rely on.
- Keep the suite small and fast. Use the lowest-cost test level that proves the outcome, with end-to-end tests for critical journeys. Avoid redundant cases and tests that merely repeat the implementation or increase coverage.
- Structure tests consistently as Given–When–Then: Given the starting conditions, When the user or system acts, Then assert the observable outcome. Follow existing naming, setup, and assertion conventions. Reuse clear setup helpers without adding unnecessary test infrastructure.
- Keep testing within the agreed scope. Discuss additional edge cases before expanding the work.
