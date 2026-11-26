---
title: "Topological Sort"
description: "Lining up the vertices of a directed graph so that every edge points forward."
tags: [algorithms, graph, topological-sort]
type: note
region: Algorithms Region
lang: en
---

A **topological order** lines the vertices up so that for every edge `u → v`, `u` comes before `v`. It exists if and only if the graph is a [[en/concepts/directed-acyclic-graph|DAG]], and it is usually not unique: two tasks that don't depend on each other can swap places and the order stays valid.

There are two ways to find one, both O(V + E): Kahn's algorithm repeatedly takes vertices of [[en/concepts/in-degree|in-degree]] 0, and DFS takes the reverse of the finishing order (see [[en/concepts/three-color-dfs|three-color DFS]]).

Read more in [[en/posts/2026-11-26-neetcode-topological-sort|station 3: Topological Sort]].
