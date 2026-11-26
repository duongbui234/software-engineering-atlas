---
title: "Union by Size"
description: "Keep DSU trees shallow by attaching the smaller group's root to the larger root."
tags: [algorithms, neetcode, graph, union-find]
type: note
region: Algorithms Region
lang: en
---

I keep the element count at each group root. On a merge, the smaller root points to the larger root, and the new size is the sum of the two old sizes. Each time a node gains depth, its group size at least doubles.

Read more in [[en/posts/2026-11-27-neetcode-union-find|Union-Find]].
