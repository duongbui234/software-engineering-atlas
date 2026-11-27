---
title: "Grid Path DP"
description: "Count or optimise paths on a grid by computing each cell from the cells that can step into it."
tags: [algorithms, neetcode, dynamic-programming]
type: note
region: Algorithms Region
lang: en
---

I treat each cell as a state: the number of ways, or the best cost, to reach it from the start. When moves only go right or down, cell (i, j) only receives from the cell above and the cell to its left, so a row-by-row, left-to-right sweep always has both values ready. The first row and column are the base cases because only one direction leads into them.

Read more in [[en/posts/2026-11-27-neetcode-grid-two-strings|DP-05]] and on the [[en/problems/unique-paths|Unique Paths]] page.
