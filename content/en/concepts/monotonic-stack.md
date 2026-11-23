---
title: "Monotonic Stack"
description: "A stack that always increases or always decreases from bottom to top; a new element that breaks the order pops the top, and it is exactly the answer the top was waiting for."
tags: ["algorithms", "stack"]
type: note
region: Algorithms Region
lang: en
---

Keep the **indices** of elements still waiting for an answer. For each new element, while it breaks the order with the top, `pop` the top and record its answer, then `push` the new element. Each index goes in once and comes out at most once, so the total is O(n) even with a `while` inside a `for` ([[en/concepts/aggregate-analysis|Aggregate Analysis]]). A decreasing stack finds the [[en/concepts/next-greater-element|next greater element]]; an increasing one finds the next smaller. When you also need to remove from the other end (a sliding window), use a [[en/concepts/monotonic-deque|Monotonic Deque]].

Read more in [[en/posts/2026-11-23-neetcode-monotonic-stack|station 7: Monotonic Stack]].
