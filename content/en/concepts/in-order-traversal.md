---
title: "In-order Traversal"
description: "Visit the left subtree, then the node, then the right subtree; on a binary search tree, that order is exactly the increasing order of the values."
tags: ["algorithms", "tree", "binary-search-tree"]
type: note
region: Algorithms Region
lang: en
---

**In-order traversal** handles a node **between** its two descents: the whole left subtree first, then the node, then the whole right subtree. On an arbitrary [[en/concepts/binary-tree|binary tree]] this order means nothing special; on a [[en/concepts/binary-search-tree|binary search tree]] it yields the values in **increasing** order, because everything on the left is smaller than the node and everything on the right is larger.

The converse holds too: a binary tree is a BST (with no duplicate values) if and only if its in-order sequence is strictly increasing. That gives a way to check a BST that only needs to remember the previous value.

The non-recursive version uses a [[en/concepts/stack|stack]]: go left as far as possible pushing each node, pop the top node and handle it, then move to its right subtree and repeat. This version **can stop midway**, so finding the k-th smallest element costs only O(h + k) instead of O(n). Unlike [[en/concepts/post-order-traversal|post-order]], the node is handled before its right subtree is visited.

Read more in [[en/posts/2026-11-25-neetcode-binary-search-tree|station 4: Binary Search Trees]].
