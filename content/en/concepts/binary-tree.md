---
title: "Binary Tree"
description: "A structure where each node has at most two children, left and right; a problem on the whole tree usually splits into the same problem on the two subtrees."
tags: ["algorithms", "tree"]
type: note
region: Algorithms Region
lang: en
---

A **binary tree** is a root node; each node holds a value and two pointers, `left` and `right`, and each pointer either points to a smaller binary tree or is empty (`null`). A node with no children is a **leaf**. The **height** is the number of nodes on the longest path from the root down to a leaf: an empty tree has height 0, a single node height 1. Two special cases matter: a **balanced** tree, about log₂ n tall, and a **skewed** tree (every node has one child), which is really a [[en/concepts/linked-list|linked list]] n tall.

The definition itself is recursive: a tree is a root plus two subtrees. That is why most tree problems take the form "solve the left subtree, solve the right subtree, combine at the root", which is [[en/concepts/post-order-traversal|post-order traversal]]. Recursion depth equals the height, so a skewed tree is where recursion breaks first. See [[en/concepts/recursion-depth-limit|Recursion Depth Limit]].

LeetCode writes a tree as a level-order array: `[1, null, 2]` is root 1, no left child, right child 2.

Read more in [[en/posts/2026-11-25-neetcode-tree-recursion|station 3: Tree Recursion]].
