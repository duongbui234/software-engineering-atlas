---
title: "In-degree"
description: "The number of edges coming into a vertex, i.e. how many tasks must still finish before it; Kahn's algorithm is built around this number."
tags: [algorithms, graph, topological-sort]
type: note
region: Algorithms Region
lang: en
---

A vertex's **in-degree** is the number of edges pointing into it: the number of prerequisites not yet taken. A vertex with in-degree 0 can be done right away.

Kahn's algorithm puts every in-degree-0 vertex in a [[en/concepts/queue|queue]], takes them out one at a time, appends each to the result, and decrements the in-degree of each neighbor; a neighbor that reaches 0 joins the queue. If fewer vertices come out than exist, the rest are stuck in a cycle: the graph is not a [[en/concepts/directed-acyclic-graph|DAG]]. A common trap: a duplicate edge must be counted once, or that in-degree never reaches 0.

Read more in [[en/posts/2026-11-26-neetcode-topological-sort|station 3: Topological Sort]].
