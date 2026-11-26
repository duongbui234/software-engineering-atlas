---
title: "Reverse Reachability"
description: "Instead of asking every point whether it can reach the target, start at the target and walk edges backward to find every point that reaches it."
tags: [algorithms, graph, bfs]
type: note
region: Algorithms Region
lang: en
---

The question "which vertices can reach the target?" can be answered with one traversal per vertex. **Reverse reachability** answers it with a single traversal: start at the target and follow edges in the opposite direction. Every vertex that gets logged has a path to the target.

In the two-oceans water problem, water flows from a cell onto a cell that is not higher, so walking backward means stepping onto a cell that is **not lower**. Two [[en/concepts/multi-source-bfs|multi-source BFS]] runs from the two shores replace one traversal per cell. The surrounded-regions problem uses the same idea: the target is the edge of the board, and every cell reachable from the edge is safe.

Read more in [[en/posts/2026-11-26-neetcode-graph-bfs|station 2: Graph Traversal and BFS]].
