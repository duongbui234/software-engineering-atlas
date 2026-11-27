---
title: "Interval DP"
description: "Make the state a subarray (l, r), solve short intervals first, then choose a split point k inside the interval."
tags: [algorithms, neetcode, dynamic-programming]
type: note
region: Algorithms Region
lang: en
---

When the answer for the whole array depends on how it is split into two parts, I let `dp[l][r]` be the best answer for the interval from l to r alone. Each interval tries every split point k and combines `dp[l][k]` with `dp[k][r]`, so the table must be filled by increasing interval length to have both shorter halves ready. There are O(n²) intervals and O(n) split points each, O(n³) in total.

Read more in [[en/posts/2026-11-27-neetcode-interval-dp|DP-07]] and on the [[en/problems/burst-balloons|Burst Balloons]] page.
