---
title: "Edge-Layer Relaxation"
description: "Separate cost updates by edge budget to enforce the step limit."
tags: [algorithms, graph, shortest-path]
type: note
region: Algorithms Region
lang: en
---

**Edge-layer relaxation** records the lowest cost to each vertex using at most `i` edges. Start each round with a copy of layer `i−1` to retain routes with fewer edges, then read source costs only from the old layer when appending one edge. Updating the ledger in place can append several edges during a single round.

Read more in [[en/posts/2026-11-27-neetcode-shortest-path|station 5: Shortest Paths]].
