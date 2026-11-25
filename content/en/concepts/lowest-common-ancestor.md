---
title: "Lowest Common Ancestor"
description: "The deepest node that has both given nodes in its subtree (a node counts as its own ancestor); in a search tree, it is where the two paths from the root split."
tags: ["algorithms", "tree", "binary-search-tree"]
type: note
region: Algorithms Region
lang: en
---

The **lowest common ancestor** (LCA) of two nodes p and q is the **deepest** node that has both p and q in its subtree. A node counts as an ancestor of itself, so if p lies in q's subtree, the answer is q.

On an arbitrary [[en/concepts/binary-tree|binary tree]], finding the LCA means asking both subtrees at every node (in [[en/concepts/post-order-traversal|post-order]] style), O(n). On a [[en/concepts/binary-search-tree|binary search tree]] a single path from the root is enough: if both p and q are smaller than the node, go left; if both are larger, go right; otherwise the two paths have split (or the node is p or q itself), and that node is the answer. The cost is O(h).

Outside LeetCode, the LCA answers "at what level do these two things meet": the nearest common directory of two paths, the common manager of two employees, the nearest common commit of two git branches (the merge base).

Read more in [[en/posts/2026-11-25-neetcode-binary-search-tree|station 4: Binary Search Trees]].
