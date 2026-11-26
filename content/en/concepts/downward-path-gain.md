---
title: "Downward Path Gain"
description: "The best sum of a path that starts at one node and descends along at most one branch."
tags: [algorithms, tree, neetcode]
type: note
region: Algorithms Region
lang: en
---

A **downward path gain** is what I can send from a node to its parent to extend a path. For a weighted sum, the node counts its own value, then adds at most one child branch with a positive sum. In [[en/concepts/post-order-traversal|postorder]], I use the gains from the children to consider a path through both branches, then return the one-branch gain the parent can extend.

Read more in [[en/posts/2026-11-26-neetcode-tree-reconstruction|station 6: Building and Serializing Trees]].
