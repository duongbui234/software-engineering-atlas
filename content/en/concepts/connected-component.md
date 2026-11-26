---
title: "Connected Component"
description: "A maximal set of vertices in an undirected graph with a path between every pair."
tags: [algorithms, graph, bfs]
type: note
region: Algorithms Region
lang: en
---

A **connected component** contains every vertex reachable from any seed in it. After one [[en/concepts/flood-fill|flood fill]], the marked cells belong to the same component. Retaining the marks during the outer scan means each unseen seed starts a new component.

Read more in [[en/posts/2026-11-26-neetcode-grid-traversal|station 1: Grid Traversal]].
