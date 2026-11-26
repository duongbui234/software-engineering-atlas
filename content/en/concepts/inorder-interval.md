---
title: "Inorder Interval"
description: "A contiguous range of indices in an inorder traversal that contains exactly the nodes of one subtree."
tags: [algorithms, tree, neetcode]
type: note
region: Algorithms Region
lang: en
---

In an [[en/concepts/in-order-traversal|inorder traversal]], the nodes of a subtree occupy one contiguous range. If the interval is `[lo, hi)` and the root is at `split`, its child intervals are `[lo, split)` and `[split + 1, hi)`. When reconstructing from preorder and inorder, I keep indices instead of copying slices, and an empty interval consumes no preorder value.

Read more in [[en/posts/2026-11-26-neetcode-tree-reconstruction|station 6: Building and Serializing Trees]].
