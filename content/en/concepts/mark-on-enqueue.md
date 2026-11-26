---
title: "Mark on Enqueue"
description: "Mark a cell as it enters the queue so other paths cannot enqueue it again."
tags: [algorithms, graph, bfs]
type: note
region: Algorithms Region
lang: en
---

Two queued cells can share one unseen neighbor. I **mark on enqueue** just before appending that neighbor. In [[en/concepts/breadth-first-search|BFS]], the assigned distance can serve as the mark, because first discovery gives a shortest distance in an unweighted graph.

Read more in [[en/posts/2026-11-26-neetcode-grid-traversal|station 1: Grid Traversal]].
