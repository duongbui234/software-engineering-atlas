---
title: "Used Marker"
description: "An array of flags recording which elements are on the current path, so each level can choose from the start again without repeats."
tags: [algorithms, neetcode, backtracking]
type: note
region: Algorithms Region
lang: en
---

For permutations order matters, so a [[en/concepts/start-index|start index]] does not work: every level must consider every element again. I keep a `used` array: set the flag before going deeper, clear it on the way back up. The flag only says whether the element is in `path` right now, so every set is paired with exactly one clear.

Read more in [[en/posts/2026-11-28-neetcode-permutations-search|MISC-02]] and on the [[en/problems/permutations|Permutations]] page.
