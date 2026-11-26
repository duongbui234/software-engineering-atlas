---
title: "Disjoint Set Union"
description: "Maintain disjoint sets with root lookup and merge operations."
tags: [algorithms, neetcode, graph, union-find]
type: note
region: Algorithms Region
lang: en
---

I use DSU to maintain a partition. Each element belongs to one set, and `find(x)` returns its representative root. `union(a,b)` links two roots when they differ. DSU pointers represent sets, while the original graph edges belong to the input.

Read more in [[en/posts/2026-11-27-neetcode-union-find|Union-Find]].
