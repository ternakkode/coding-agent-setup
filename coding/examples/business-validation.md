# Example: Reusable Business Validation

Reuse named checks from existing domain validation or authorization modules. A validation package can group them; these locations illustrate ownership rather than require new files or dependencies.

## Example Structure

```text
validation/
├── authorization   # Admin requirement
└── funds           # Available-funds requirements

scripts/
└── withdraw-funds  # Load inputs, validate, then perform the action
```

Shape validation stays at the input boundary. These checks receive established types and required fields.

## Pseudocode

Assume admins may withdraw when funds are sufficient. Admin status is the complete authorization requirement. The amount is already positive and uses the account's currency and numeric convention.

```text
// Script entry point using existing data-access and execution interfaces.
function withdrawFunds(actorId, accountId, amount):
    actor = retrieveActor(actorId)
    account = retrieveAccount(accountId)

    requireAdmin(actor)
    requireSufficientFunds(account.availableFunds, amount)

    return executeWithdrawal(actor, account, amount)

// validation/authorization
function requireAdmin(actor):
    if actor does not have the admin role:
        fail with forbiddenOperation("Admin role required")

// validation/funds
function requireSufficientFunds(availableFunds, requestedAmount):
    if availableFunds < requestedAmount:
        fail with insufficientFunds
```

Import checks by name and call them directly. Each succeeds or stops the operation under the existing error convention. Retrieval and execution remain outside validation. Additional checks must enforce distinct requirements; reuse existing policy rather than duplicating it.

## Cohesion and Coupling

Authorization owns access policy; funds validation owns balance rules. `requireAdmin` needs role data, while `requireSufficientFunds` needs amounts. Neither needs a database connection, vendor client, or the script's whole context.

Policy changes stay with their domain owner. The script changes when the required steps change. Avoid generic validators controlled by flags; preserve existing decision-returning interfaces where callers need a decision rather than a failing check.

## Trace and Review

- Non-admin: stop before execution.
- Admin with insufficient funds: report the funds error.
- Admin with available funds equal to the requested amount: pass validation.

`executeWithdrawal` preserves existing atomic authorization and balance guarantees; prechecks alone cannot protect against state changes before execution.

Check that rules have clear owners, callers expose the selected checks, and validation does not repeat shape guarantees.

Return to [code quality](../code-quality.md#contracts-and-validation).
