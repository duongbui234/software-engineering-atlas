---
title: "Memoized DFS"
description: "Let recursion find the order in which states are computed, and store each vertex's answer when the graph has no cycle."
tags: [algorithms, neetcode, dynamic-programming, graph]
type: note
region: Algorithms Region
lang: en
---

When the states do not line up in one simple sweep, I start a DFS at a vertex and let it ask its neighbours first. If every edge goes in a strictly increasing direction, the graph has no cycle, so no visited set is needed: once a vertex is computed I store it, and later calls only read it. The DFS finishing order is itself a topological order, and peeling layers by degree is the iterative replacement for deep recursion.

Read more in [[en/posts/2026-11-27-neetcode-state-machine-dp|DP-06]] and on the [[en/problems/longest-increasing-path-in-a-matrix|Longest Increasing Path in a Matrix]] page.
