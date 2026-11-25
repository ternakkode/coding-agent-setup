# Pull Request Walkthrough

The page lets a reviewer check the direction of a PR without reading the whole diff: a small, exact part of the code, with each decision next to the code it shapes.

## Gather

Get the facts once with `gh pr view <pr> --json url,title,body,additions,deletions,headRefOid,files` and save the diff with `gh pr diff <pr> > tmp/pr.diff`; search and slice that file rather than loading it whole. In a local clone, `git fetch origin <head sha>` and `git show <sha>:<path>` read files at the head commit; elsewhere use `gh api`. Never check out, pull, or stash in a working copy you were not given.

Read the description, every design document it links or adds (including open questions and out-of-scope lists), the diff, and the open review threads that people (not bots) started; only GraphQL tells open threads from resolved ones (`gh api graphql` on `pullRequest.reviewThreads` with `isResolved` and `comments`). Then read the changed code at the head commit, and the unchanged code the feature relies on, until you know the contracts between the parts. Judge everything you read as [product judgment](../../coding/product-judgment.md) describes. Skip what you wrote this session and still know.

## Story

The reader may know the product but not this PR. Explain what changes for the people who use the product before any code, in everyday words, and explain every code or domain term the first time it appears. One page, in this order; leave out what the PR does not have:

1. **Header:** the PR title, the problem and the chosen solution in a few plain sentences, the shown-lines line, and **Check these** (see below).
2. **Product behavior:** who uses this and what they want; what they do and see before and after the PR, including what they can expect when it goes wrong. For a PR without user-visible behavior, say who notices the change (an operator, another service, a developer) and how, or say plainly that nothing changes for users yet and what the PR prepares.
3. **Real-world examples:** walk through one or more concrete flows step by step, with real names, numbers and timing ("a trader buys 0.01 BTC at $98,000; 40% fills, so ..."), from the user's action to the final result. Cover the main path and each ending that matters (cancel, failure, timeout). These are scenarios, not code.
4. **Diagrams:** draw the flow, as the `artifact-diagramming` skill describes: the steps or states a request moves through, and the parts that talk to each other when there are more than two. A PR that only touches one part may need just a state or timeline diagram; draw at least one whenever the PR has a flow a reader would otherwise assemble from prose.
5. **Decisions,** each in the plain-language form under Decisions below, placed in the section it shapes or here when it covers the whole PR.
6. **One code section per system part,** in the order the data or control moves: producer before consumer, caller before callee. Name each section after the part, not after a file, and open it with one sentence on what the part does for the user.
7. **Tests.**
8. **Verified** and **Remaining.** **Changes** is the page itself.

## Code

Each diff is unified lines: `+` added, `-` removed, a space unchanged. Shorten the code with the language's comment syntax for left-out parts (`// ...`, `# ...`), and keep the enclosing declaration so the reader knows where the code sits. When code exists on both sides, show it on both sides, shortened the same way, so only real changes are `+` or `-`. Caption each diff with its path, linked to the line at the head commit.

- **Show:** signatures, types, and contracts between parts; both ends of each contract (where the value is made and where it is read); code on hot paths; comments that explain a why; a removed safety net (try/catch, fallback) on the old side; a legacy path that stays.
- **Leave out:** imports, guards on inputs, internal helpers, implementation that the names already describe, test bodies, generated files, and code that only moves or is renamed. Show a change repeated in many places once, with a comment naming the other places.
- **Prose** says only what the code cannot show: a why, a cost, or a fact about code the page leaves out.

Keep the shown lines under 20% of the PR's added plus removed lines, and much lower for large PRs.

## Decisions

Take the decisions from the description's Decisions section. When it has none, use the choices the description or code comments state ("deliberately", "instead of"), mark them implicit, and tell the user to add them to the description.

The author's reason is not the verdict: judge each decision, and each behavior inherited from existing code, by the best experience for the user. When one hurts users, add it to **Check these** with a real example and a better option.

Rewrite each one in normal language for a reader who has not seen the code: what was chosen, what it means for the user in practice (one short example), what it costs, and what else was possible and why not. Keep the author's code names only in brackets after the plain words, never in place of them.

## Tests

- List every test the PR adds, removes, or changes in what it checks, grouped by file and by describe block. Write the names in words, as close to the code name as possible.
- Find removed tests in the diff's removed lines (for example `grep -E '^-\s*(it|test|describe)\(|^-\s*def test_|^-\s*func Test' tmp/pr.diff`), and drop those whose name comes back on an added line. A test renamed with the same checks is `modified`, with the old name in its `title`.
- Before listing a test, read its full body: in the diff when it is new and complete there, else at the head commit. When its name claims something no assertion checks, list a name written from the assertions and add a callout with the code name and what it really checks. Check each case of a parameterized test on its own.

## Check These

Also compare the description with the code, and settings with their comments, and walk the user's full real flow for behavior that blocks or surprises them. Show briefly the unchanged parts the feature relies on, saying which are reused, placeholders, or missing. Put each mismatch, or each value that looks wrong, in a callout next to the code it concerns, and link them all from the header's **Check these** callout. Tell the user about them too.

## Page

Copy [`template.html`](template.html) with `cp`, then edit only its `PR_` placeholders and the two comment slots. `PR_GENERATED` is the added plus removed lines in generated or lock files (0 when none); the template's script counts the shown lines. Its markup:

```html
<p class="note">Prose.</p>
<div class="example"><h3>Example: a trader's limit order fills</h3>
  <ol class="steps"><li>Step in plain words, with numbers.</li></ol></div>
<figure class="diagram"><svg viewBox="0 0 W H" role="img" aria-label="The claim">…</svg>
  <figcaption>What the diagram shows.</figcaption></figure>
<aside class="callout"><span class="label">Check</span>A finding.</aside>
<details class="decision"><summary>Choice<span class="tag">Implicit</span></summary>
  <div><p class="note">Why.</p><p><span class="label">Trade-off</span>…</p><p class="note"><span class="label">Alternatives</span>…</p></div></details>
<figure class="diff"><figcaption><a href="…/blob/<head sha>/<path>#L<n>">path</a></figcaption><pre>
 unchanged
+added
</pre></figure>
<div class="tests"><h3>test/file/path</h3><p>Describe block</p>
  <ul><li data-change="added|modified|removed">test name in words</li></ul></div>
```
