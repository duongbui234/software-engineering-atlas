---
title: "Post-order Traversal"
description: "Visit both subtrees first, then handle the node: the only order in which a node can use its children's finished results."
tags: ["algorithms", "tree", "recursion"]
type: note
region: Algorithms Region
lang: en
---

There are three depth-first orders on a [[en/concepts/binary-tree|binary tree]], differing in when the node itself is handled: before its two children (pre-order), between them (in-order), or **after both (post-order)**. Post-order is the "bottom-up" order: when a node's turn comes, the height, sum or state of both subtrees is already known, so the node only has to combine them.

A common pattern is a recursive function that **returns one quantity** to the parent (the height) and **records another** in an outer variable (the best diameter so far). When the returned quantity also has to carry a "something broke" signal, a [[en/concepts/sentinel-value|sentinel value]] such as -1 does it without returning two values.

Without recursion, post-order needs an explicit [[en/concepts/stack|stack]], and each node is pushed twice: the first time to push its two children, the second time (with a "children done" flag) to compute the node itself.

Read more in [[en/posts/2026-11-25-neetcode-tree-recursion|station 3: Tree Recursion]].
