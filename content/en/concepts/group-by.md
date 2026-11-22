---
title: "Group By"
description: "Gather elements with the same key into one list, using a key → list hash map."
tags: ["algorithms", "hashing"]
type: note
region: Algorithms Region
lang: en
---

**Group by** walks the data once: compute the key, then append the element to that key's list (`defaultdict(list)` in Python, `computeIfAbsent` in Java, `append(groups[k], x)` in Go). The order of the groups depends on the map: Python and JS keep insertion order, Java's `HashMap` and Go do not, and Go even deliberately shuffles it on every run.

Read more in [[en/posts/2026-11-22-neetcode-group-anagrams|Group Anagrams]].
