---
title: "Visit-and-Restore"
description: "Mark the cell being visited in the data itself, then write the old value back when backtracking, instead of a separate visited table."
tags: [algorithms, neetcode, backtracking, grid]
type: note
region: Algorithms Region
lang: en
---

When searching paths on a grid, a cell may not be used twice on the same path, but another path may still pass through it. I overwrite the cell with a marker character such as `#` before the recursive call and write the old letter back as soon as the call returns. It costs no extra memory, but forgetting the restore leaves a damaged grid for every later search.

Read more in [[en/posts/2026-11-28-neetcode-permutations-search|MISC-02]] and on the [[en/problems/word-search|Word Search]] page.
