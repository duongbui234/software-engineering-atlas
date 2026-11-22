---
title: "Canonical Key"
description: "A representative value such that two objects are equivalent if and only if they have that same value."
tags: ["algorithms", "hashing"]
type: note
region: Algorithms Region
lang: en
---

A **canonical key** turns a pairwise comparison problem into grouping by key. For anagrams, the key can be the sorted letters (`eat` → `aet`) or a 26-slot count table. The condition must hold in both directions: equivalent objects get the same key (no split groups), non-equivalent objects get different keys (no wrong merges).

Read more in [[en/problems/group-anagrams|Group Anagrams]].
