---
title: "Knapsack Update Order"
description: "The sweep direction preserves the old or current source cell in a rolling knapsack table."
tags: [algorithms, dynamic-programming, neetcode]
type: note
region: Algorithms Region
lang: en
---

After rolling the rows, cell s can read a cell at s − x written during the same pass. For positive x, sweeping down keeps the smaller cell in the previous row and uses the item once. Sweeping up allows another copy of the current type.

Read more in [[en/posts/2026-11-27-neetcode-knapsack|DP-03]].
