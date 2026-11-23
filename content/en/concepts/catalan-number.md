---
title: "Catalan Number"
description: "The sequence 1, 1, 2, 5, 14, 42, … counts valid strings of n pairs of parentheses and many other nested structures; it grows roughly like 4ⁿ / n^1.5."
tags: ["algorithms", "combinatorics"]
type: note
region: Algorithms Region
lang: en
---

The **Catalan number** `C(n) = (2n)! / ((n+1)! · n!)` counts the strings of n correctly nested pairs of parentheses, the binary trees with n nodes, and the ways to parenthesize a product of n + 1 factors. The first ten values from n = 1: 1, 2, 5, 14, 42, 132, 429, 1 430, 4 862, 16 796 (sequence A000108 in the OEIS). It grows roughly like `4ⁿ / (n^1.5 · √π)`, so a problem that asks you to **list** these structures cannot run faster than that; good [[en/concepts/backtracking|backtracking]] only trims the waste beyond the output.

Read more in [[en/problems/generate-parentheses|Generate Parentheses]].
