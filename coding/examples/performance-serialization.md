# Example: Trust the Performance Contract

This public-response mapper illustrates the supplied performance excerpt. Verify the assumptions against actual producers and types before removing checks.

## Establish the Guarantees

- Performance is absent (`null`) or complete, with required leader, follower, and PnL fields.
- Numeric fields satisfy the calculation and formatting contract; `signed` is the existing public formatter.
- ROI, latest fill time, and terminal account timings may legitimately be null.
- Absent performance contributes no performance fields. Null public fields are omitted.

The producer or input boundary establishes validity; the mapper owns public representation.

## Redundant Validation

With those guarantees, these checks and fallbacks are unnecessary:

```text
if performance is not null:
    if follower is missing or pnl is missing:
        return empty result

    if netPnl is not a number or is not finite:
        netPnl = 0

    if latestFillAt is not null and is not a timestamp:
        omit latestFillAt
```

They invent behavior: incomplete performance disappears, invalid PnL becomes zero, or invalid timestamps become indistinguishable from no fill. Resolve genuine uncertainty at its input boundary.

## Pseudocode

```text
function serializeFollowerPerformance(performance):
    // Absent performance is an allowed state, not malformed input.
    if performance is null:
        return empty record

    follower = performance.follower

    result = record:
        grossRealizedPnl = signed(follower.pnl.grossRealizedPnl)
        grossUpnl = signed(follower.pnl.unrealizedPnl)
        fundingPayment = signed(follower.pnl.funding)
        tradeFee = signed(follower.pnl.tradingFees)
        pearFee = signed(follower.pnl.platformFees)
        totalNetPnl = signed(follower.pnl.netPnl)
        provisional = follower.provisional

    // Preserve the public omission contract for genuinely nullable fields.
    if follower.returnOnStartingEquityPercent is not null:
        result.roi = signed(follower.returnOnStartingEquityPercent)

    if follower.latestFillAt is not null:
        result.latestFillAt = follower.latestFillAt

    return result
```

The supplied serializers already use null branches for allowed absence and omission. Removing them changes the public contract. Map fields directly and reuse existing serializers for coherent transformations or meaningful duplication.

## Trace and Review

- Null performance returns an empty record.
- Complete performance maps required fields without repeated shape or number checks.
- Null ROI or fill time omits its field; zero ROI and zero PnL remain valid. Check null explicitly rather than truthiness.
- Missing required fields violate the contract; they are not agreed zero or empty results.

Before adding a check, identify its uncertainty or business rule. Before removing one, verify the upstream guarantee and preserve complete, absent, and zero-value outcomes.

Return to [code quality](../code-quality.md#contracts-and-validation).
