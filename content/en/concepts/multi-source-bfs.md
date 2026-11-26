---
title: "Multi-source BFS"
description: "Start every source in the queue at distance zero so one BFS finds distances to the nearest source."
tags: [algorithms, graph, bfs]
type: note
region: Algorithms Region
lang: en
---

In **multi-source BFS**, I enqueue every source before processing the first cell. On a unit-weight graph the queue processes nondecreasing distances. Each vertex is first discovered from a nearest source. An unreachable vertex stays unmarked.

Read more in [[en/posts/2026-11-26-neetcode-grid-traversal|station 1: Grid Traversal]].
