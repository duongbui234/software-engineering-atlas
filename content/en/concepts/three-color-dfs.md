---
title: "Three-Color DFS"
description: "A DFS that marks each vertex white, gray or black; reaching a gray vertex again means there is a cycle."
tags: [algorithms, graph, topological-sort]
type: note
region: Algorithms Region
lang: en
---

**Three-color DFS** gives each vertex a state: white (not touched), gray (on the current path, not finished) and black (every branch explored). Following an edge into a gray vertex means coming back onto the path I'm on: there is a cycle. Reaching a black vertex is fine; that branch is already checked.

A single "visited" set is not enough: it mixes gray with black, so it reports a false cycle when two paths meet at the same vertex (a diamond). The order in which vertices turn black, reversed, is a [[en/concepts/topological-sort|topological order]]. Recursion goes as deep as the number of vertices, so for long chains use an explicit stack.

Read more in [[en/posts/2026-11-26-neetcode-topological-sort|station 3: Topological Sort]].
