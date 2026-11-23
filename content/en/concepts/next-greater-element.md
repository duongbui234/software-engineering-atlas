---
title: "Next Greater Element"
description: "For each position, the first element to its right that is larger; found for every position in O(n) with a decreasing monotonic stack."
tags: ["algorithms", "stack"]
type: note
region: Algorithms Region
lang: en
---

The direct way is for each position to scan right: O(n²) when the array decreases. Flip the question: each new element pops from a [[en/concepts/monotonic-stack|monotonic stack]] every element smaller than it, and it is their next greater element. Whatever remains on the stack has no answer. Variants: next smaller (an increasing stack), greater on the left (read the remaining top after popping), or a circular array (walk twice).

Read more in [[en/problems/daily-temperatures|Daily Temperatures]].
