---
title: "Minimax Path"
description: "Choose a path whose largest value along the way is the smallest among all feasible paths."
tags: [algorithms, graph, shortest-path]
type: note
region: Algorithms Region
lang: en
---

A **minimax path** measures a route by the largest value along it. In a rising water grid, wait for the greatest elevation among cells on the route, including the source. Adding a cell can only preserve or raise the maximum, so the [[en/concepts/dijkstra|Dijkstra loop]] can use an adapted update rule.

Read more in [[en/posts/2026-11-27-neetcode-shortest-path|station 5: Shortest Paths]].
