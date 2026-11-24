---
title: "Tree Hashing"
description: "Give every subtree a code computed from its root value and its two children's codes, so two identical subtrees share a code and compare in O(1)."
tags: ["algorithms", "tree", "hashing"]
type: note
region: Algorithms Region
lang: en
---

Comparing two [[en/concepts/binary-tree|trees]] by walking them side by side costs O(size). When you must compare many times, as in [[en/problems/subtree-of-another-tree|Subtree of Another Tree]] (try every node of the big tree as a root), the cost climbs to O(m · n). **Tree hashing** computes a code for every subtree in [[en/concepts/post-order-traversal|post-order]]: `code(node) = H(value, code(left), code(right))`, with one fixed code for the empty tree. Two identical subtrees get the same code, so "does this subtree appear?" becomes looking up the small tree's code among the big tree's codes: O(m + n). It is the same idea as the Merkle tree Git uses for directories.

There are two ways to pick `H`: a numeric hash function (fast, but two different trees can collide, so a matching code must be confirmed by walking both trees), or **canonical numbering**: a [[en/concepts/hash-map|hash map]] from the tuple `(value, left number, right number)` to a fresh integer. Numbering never collides, because two different tuples always get two different numbers.

Read more in [[en/posts/2026-11-25-neetcode-tree-recursion|station 3: Tree Recursion]].
