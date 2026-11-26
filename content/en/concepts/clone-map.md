---
title: "Clone Map"
description: "A map from each old node to its copy that serves as the visited log and tells where to connect edges while copying a graph."
tags: [algorithms, graph, bfs]
type: note
region: Algorithms Region
lang: en
---

When I deep-copy a graph, I keep a **clone map** `old → new`. The first time I meet an old node, I create its copy and record it in the map before going on from that node. Every time I read an edge `u – v`, I connect `copy[u]` to `copy[v]`.

The map does two jobs at once. It is the visited log, so on a graph with a cycle I don't go around forever or create two copies of one node. It also answers "which node is v's copy?", which an ordinary visited set can't. The map's keys must be the node objects themselves, not their values.

Read more in [[en/posts/2026-11-26-neetcode-graph-bfs|station 2: Graph Traversal and BFS]].
