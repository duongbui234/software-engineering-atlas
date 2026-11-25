---
title: "Level Size Snapshot"
description: "At the top of each BFS round, record how many nodes the queue holds: exactly that many nodes form one level, and their children belong to the next."
tags: ["algorithms", "tree", "bfs"]
type: note
region: Algorithms Region
lang: en
---

In a [[en/concepts/breadth-first-search|BFS]] over a tree, the children of a level are pushed into the same queue, right behind the nodes of that level still waiting. Nothing in the queue marks where a level ends. A **level size snapshot** creates that boundary: at the top of each round, read `size` as the queue length, then take out exactly `size` nodes. Those nodes are one whole level; everything pushed while taking them belongs to the next.

The trap is letting the loop condition reread the queue length each time (`i < queue.length` in JavaScript, Java or Go). The length grows as children go in, so the loop takes the next level too and every node lands in one level: on the station's 300 random trees, the version without a snapshot is wrong on 294. Python's `for _ in range(len(q))` snapshots by itself, because `range` is evaluated once.

With `size` in hand you know which node opens a level (i = 0) and which closes it (i = size − 1). The last node of each level is the tree's view from the right.

Read more in [[en/posts/2026-11-25-neetcode-level-order|station 5: Level Order and Carried State]].
