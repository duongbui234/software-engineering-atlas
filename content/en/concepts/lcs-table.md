---
title: "LCS Table"
description: "A table of longest-common-subsequence lengths for every pair of prefixes, moving diagonally when the last characters match."
tags: [algorithms, neetcode, dynamic-programming, string]
type: note
region: Algorithms Region
lang: en
---

Cell (i, j) holds the LCS length of `a[0:i]` and `b[0:j]`. If the two last characters are equal, I take the diagonal plus 1; otherwise I drop the last character of one string and take the larger of the cell above and the cell to the left. Printing the subsequence itself needs the whole table, to walk back from the bottom-right corner.

Read more in [[en/posts/2026-11-27-neetcode-grid-two-strings|DP-05]] and on the [[en/problems/longest-common-subsequence|Longest Common Subsequence]] page.
