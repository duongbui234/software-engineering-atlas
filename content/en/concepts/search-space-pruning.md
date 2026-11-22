---
title: "Search Space Pruning"
description: "Discard a whole group of candidates with one comparison, because you can prove none of them is the answer."
tags: ["algorithms"]
type: note
region: Algorithms Region
lang: en
---

Instead of trying every candidate (all pairs `(i, j)` is n²/2 tries), **search space pruning** proves that a whole group cannot contain the answer and drops the group. With [[en/concepts/two-pointers|two pointers]], each step crosses out one row of the n × n table of pairs, so the total is only n − 1 steps. The reason to prune must be a proof, not a hunch: in Container With Most Water, moving the taller wall "looks reasonable" but is wrong.

Read more in [[en/problems/two-sum-ii-input-array-is-sorted|Two Sum II]] and [[en/problems/container-with-most-water|Container With Most Water]].
