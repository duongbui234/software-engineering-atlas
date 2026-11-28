---
title: "Jump Layers"
description: "Split the array into consecutive blocks, each holding the cells reachable with exactly k jumps; counting blocks counts BFS levels without a queue."
tags: [algorithms, neetcode, greedy]
type: note
region: Algorithms Region
lang: en
---

The cells reachable with 0 jumps are `[0, 0]`, with 1 jump the block right after that up to the previous layer's `farthest`, and so on. This is level-by-level [[en/concepts/breadth-first-search|BFS]], except each level is a contiguous block, so two numbers `end` and `farthest` replace the queue. When `i` reaches `end` the current layer is used up: I add one jump and set `end = farthest`.

Read more in [[en/posts/2026-11-28-neetcode-greedy-array|MISC-03]].
