---
title: "Breadth-First Search"
description: "Visit every node one step from the start, then every node two steps away, using a first-in, first-out queue."
tags: ["algorithms", "tree", "bfs"]
type: note
region: Algorithms Region
lang: en
---

**Breadth-first search (BFS)** moves outward from the starting point in rings: all nodes one step away before any node two steps away. The tool is a first-in, first-out queue: take a node from the front, push its neighbors at the back. On a [[en/concepts/binary-tree|binary tree]], "k steps away" means "at level k", so BFS yields nodes level by level, left to right.

Each node enters and leaves the queue exactly once, so BFS takes O(n) time. The extra memory is the queue's longest length, which is the **widest level**: in a perfect tree of 2²⁰ − 1 nodes the queue reaches 524,288 nodes, while depth-first search only has to remember 20 levels. On a skewed chain it is the other way around: the queue holds 1 node while recursion goes as deep as the whole chain.

Taking from the front must cost O(1). JavaScript's array `shift()` and Python's list `pop(0)` move the whole array every time, so on a large tree BFS becomes O(n²); use a front index or `collections.deque`. To split the output into levels you also need a [[en/concepts/level-size-snapshot|level size snapshot]].

Read more in [[en/posts/2026-11-25-neetcode-level-order|station 5: Level Order and Carried State]].

Read more in [[en/posts/2026-11-26-neetcode-grid-traversal|station 1: Grid Traversal]], where all starting cells share the same layer zero.
