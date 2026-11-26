---
title: "Flood Fill"
description: "Traverse from a seed to mark every reachable cell in a region."
tags: [algorithms, graph, bfs]
type: note
region: Algorithms Region
lang: en
---

**Flood fill** takes one seed and a rule for movement. I use DFS or BFS to expand to eligible neighbors and mark each cell on discovery. When no cells remain to process, the marks cover the region reachable from the seed.

Read more in [[en/posts/2026-11-26-neetcode-grid-traversal|station 1: Grid Traversal]].
