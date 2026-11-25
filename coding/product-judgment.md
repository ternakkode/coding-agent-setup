# Product Judgment

Use when designing, reviewing, planning, or explaining any change, including someone else's pull request.

- The standard is the best experience for the people who use the product, not the existing code, its author, or how a similar feature works today. Code writers are not always right, and inherited behavior is a choice like any other.
- Walk the real flow end to end before judging, with real numbers and timing: the user starts, waits as long as it can really last, changes their mind, uses the same thing elsewhere at the same time, cancels or undoes, sees the result and learns about it, and hits each failure.
- Where the user is blocked, surprised, or left worse off, say so with one concrete example and a better option, even when it was chosen on purpose or copied from an existing feature. Also ask whether an existing feature already meets the need with less new machinery.
- When a design is reused from another feature, check that the assumptions it was built on still hold. Example: a position lock that was harmless for an order lasting minutes blocks the user for days on an order with no deadline; a tracking loop sized for busy orders wastes calls on orders where nothing happens for days.
- Cover what the change relies on, not only what it touches: the design documents it links or adds (including open questions and out-of-scope lists) and the unchanged code on its path. Say which parts are reused, which are placeholders, and which are missing.
- Keep what is proven separate from what is guessed.
- When writing on someone's behalf, such as posting their review, include only their points; offer your own separately.
