---
title: "Conflict Sets"
description: "Sets recording occupied columns and diagonals, so whether a cell conflicts can be checked in O(1)."
tags: [algorithms, neetcode, backtracking]
type: note
region: Algorithms Region
lang: en
---

When placing pieces row by row, I only need to know whether the column and the two diagonals of the target cell are already taken. Every cell on one main diagonal shares `r − c`, and every cell on one anti-diagonal shares `r + c`, so three sets (or three bitmasks) answer at once. Placing a piece adds to all three sets; backtracking removes it from all three.

Read more in [[en/posts/2026-11-28-neetcode-permutations-search|MISC-02]] and on the [[en/problems/n-queens|N-Queens]] page.
