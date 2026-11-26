---
title: "Dijkstra"
description: "Finalize vertices from the smallest known distance when edge weights are nonnegative."
tags: [algorithms, graph, shortest-path]
type: note
region: Algorithms Region
lang: en
---

**Dijkstra** maintains a tentative cost for each vertex and takes the smallest waiting record. With nonnegative weights, the first edge crossing from finalized to unfinalized vertices on any better route would create a smaller record, so a current pop finalizes the distance. When the heap also holds old entries, check the distance ledger before examining outgoing edges.

Read more in [[en/posts/2026-11-27-neetcode-shortest-path|station 5: Shortest Paths]].
