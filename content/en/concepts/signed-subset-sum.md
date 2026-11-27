---
title: "Signed Subset-Sum Reduction"
description: "Count sign assignments by choosing positions summing to half of S − target."
tags: [algorithms, dynamic-programming, neetcode]
type: note
region: Algorithms Region
lang: en
---

I start with total S when every position is positive. Flipping positions with sum N reduces the total by 2N. Each valid set of positions determines one assignment, including choices at zero-valued positions.

Read more in [[en/posts/2026-11-27-neetcode-knapsack|DP-03]].
