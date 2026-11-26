---
title: "Bidirectional BFS"
description: "Run BFS from the start and the target at the same time, expand one layer of the smaller side per round, and stop when the two sides meet."
tags: [algorithms, graph, bfs]
type: note
region: Algorithms Region
lang: en
---

**Bidirectional BFS** keeps two sets: the vertices reached from the start and the vertices reached from the target. Each round, I expand **a full layer** of the smaller set. When a newly generated vertex already belongs to the other set, the path length is the total number of layers both sides have gone.

If each vertex has about b neighbors and the shortest path has length d, one side has to touch around b^d vertices, while two sides touch only around 2·b^(d/2). The target must be known in advance, and edges must be walkable in both directions (or I must know how to walk them backward). In my Word Ladder measurement it took out 102 words instead of 4,293.

Read more in [[en/posts/2026-11-26-neetcode-graph-bfs|station 2: Graph Traversal and BFS]].
