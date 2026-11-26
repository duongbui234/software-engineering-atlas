---
title: "Hierholzer's Algorithm"
description: "Finalize a suffix to splice circuits into an Eulerian trail."
tags: [algorithms, neetcode, graph]
type: note
region: "Algorithms Region"
lang: en
---

Hierholzer's algorithm follows unused edges and saves the temporary walk on a stack. When the top vertex has no outgoing edges left, move it to the reversed result. Reverse after consuming the edges to read the Eulerian trail in order.

Read more in [[en/posts/2026-11-27-neetcode-spanning-tree-itinerary|the station post]].
