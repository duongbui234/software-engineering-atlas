---
title: "Edit Operations"
description: "Insert, delete and replace one character: the three steps behind the Levenshtein distance of two strings."
tags: [algorithms, neetcode, dynamic-programming, string]
type: note
region: Algorithms Region
lang: en
---

Each edit maps to one direction in the two-string table: delete reads the cell above, insert reads the cell to the left, replace reads the diagonal. When the last characters already match, the diagonal step is free. Row 0 and column 0 equal the number of insertions or deletions needed to turn the empty prefix into the other one.

Read more in [[en/posts/2026-11-27-neetcode-grid-two-strings|DP-05]] and on the [[en/problems/edit-distance|Edit Distance]] page.
