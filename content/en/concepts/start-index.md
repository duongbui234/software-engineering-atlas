---
title: "Start Index"
description: "Let the next call choose only from position start onward, so each combination is built in exactly one order."
tags: [algorithms, neetcode, backtracking]
type: note
region: Algorithms Region
lang: en
---

The combinations `[1, 2]` and `[2, 1]` are the same. To avoid building it twice, the next call may only choose elements after the one just chosen. Pass `i + 1` when each element may be used once, and `i` when it may be reused (Combination Sum). Permutations are the opposite: no start index, but a mark on each used element.

Read more in [[en/posts/2026-11-28-neetcode-subsets-combinations|MISC-01]] and on the [[en/problems/combination-sum|Combination Sum]] page.
