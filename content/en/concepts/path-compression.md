---
title: "Path Compression"
description: "Shorten root lookup paths in the DSU representative forest."
tags: [algorithms, neetcode, graph, union-find]
type: note
region: Algorithms Region
lang: en
---

While finding a DSU root, I change pointers along the path to speed up later lookups. The station's halving version connects the current node to its grandparent and then moves to that grandparent. The nodes still lead to the same root, so group membership stays the same.

Read more in [[en/posts/2026-11-27-neetcode-union-find|Union-Find]].
