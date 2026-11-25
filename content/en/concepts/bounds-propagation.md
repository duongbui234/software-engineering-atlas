---
title: "Bounds Propagation"
description: "Pass a range (lo, hi) down from the root: each left turn lowers the upper bound, each right turn raises the lower bound, so every node is checked against the constraints of all its ancestors with a single comparison."
tags: ["algorithms", "tree", "binary-search-tree"]
type: note
region: Algorithms Region
lang: en
---

**Bounds propagation** packs the constraints of all ancestors into two numbers. The root receives the open range (−∞, +∞). Going to the left child of a node with value v makes the upper bound v; going to the right child makes the lower bound v. A node is valid when its value lies strictly inside the range it received.

This is the right way to check a [[en/concepts/binary-search-tree|binary search tree]]. Comparing a node only with its parent misses a deep node that violates a more distant ancestor: in the station's file, that check accepts 66 of 238 broken trees. The range is information flowing **top-down**, the opposite of the height flowing bottom-up in [[en/concepts/post-order-traversal|post-order traversal]].

The common trap is picking "infinity": using the smallest or largest 32-bit int as a bound makes a node holding exactly that value fail. Use a wider type (long), floating-point infinity, or null meaning "no bound".

Read more in [[en/posts/2026-11-25-neetcode-binary-search-tree|station 4: Binary Search Trees]].
