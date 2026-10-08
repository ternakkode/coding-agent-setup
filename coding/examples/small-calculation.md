# Example: A Small Calculation

Use this shape when the whole rule fits in one function. Assume the agreed inputs are finite numbers and the caller expects either an average or an explicit unavailable result. Numeric precision follows the project's existing convention.

## Pseudocode

```text
function calculateAverage(values):
    if values is empty:
        return unavailable("No observations")

    return sum(values) / count(values)
```

## Trace and Review

The inputs, empty-input branch, and result are visible together. There is no shared state or external effect.

For `[2, 4]`, the result is `3`. For `[]`, it is `unavailable("No observations")`. A reviewer can check both outcomes directly against the sketch.

Keep the arithmetic together. Separate `sumValues` and `divideByCount` helpers would add navigation without clarifying another responsibility. If the real task has weighting or precision rules, expand those rules where correctness depends on them.

Return to [code quality](../code-quality.md#examples).
