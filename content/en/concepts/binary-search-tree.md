---
title: "Binary Search Tree"
description: "A binary tree where every value in the left subtree is smaller than the node and every value in the right subtree is larger; each comparison discards a whole branch."
tags: ["algorithms", "tree", "binary-search-tree"]
type: note
region: Algorithms Region
lang: en
---

A **binary search tree** (BST) is a [[en/concepts/binary-tree|binary tree]] that keeps one invariant at **every** node: every value in the whole left subtree is smaller than the node's value, and every value in the whole right subtree is larger. "The whole subtree" is the part people misread: comparing a node with its two direct children is not enough.

Thanks to that invariant, each comparison at a node discards a whole branch, just like [[en/concepts/binary-search|binary search]] on a sorted array. Search, insert and finding the [[en/concepts/lowest-common-ancestor|lowest common ancestor]] all walk **one path** down from the root, costing O(h), where h is the height. A balanced tree has h ≈ log₂ n; a tree filled in increasing order is skewed into a chain, h = n. Standard libraries (Java's TreeMap, C++'s std::map) use self-balancing trees such as red-black trees to keep h around log n.

The second consequence: an [[en/concepts/in-order-traversal|in-order traversal]] of a BST yields its values in increasing order. To check whether a tree is a BST, use [[en/concepts/bounds-propagation|bounds propagation]] or check that the in-order sequence is strictly increasing.

Read more in [[en/posts/2026-11-25-neetcode-binary-search-tree|station 4: Binary Search Trees]].
