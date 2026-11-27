---
title: "Unbounded Knapsack"
description: "An item type can contribute multiple copies to the same solution."
tags: [algorithms, dynamic-programming, neetcode]
type: note
region: Algorithms Region
lang: en
---

I process a type with positive weight x. To take another copy, sum s reads cell s − x of the current row. Since s − x < s, I fill the row in ascending order.

Read more in [[en/posts/2026-11-27-neetcode-knapsack|DP-03]].
