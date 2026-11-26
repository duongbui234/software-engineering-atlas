---
title: "Pre-order Traversal"
description: "Handle the node first, then go down into its two subtrees: the order in which a parent hands information to its children before they are visited."
tags: ["algorithms", "tree", "recursion"]
type: note
region: Algorithms Region
lang: en
---

**Pre-order traversal** handles the node before its two children: node, left subtree, right subtree. It is the reverse direction of [[en/concepts/post-order-traversal|post-order]]: post-order lets children return results **up** to the parent, while pre-order lets the parent hand information **down** to its children, through the parameters of the recursive call. The range (lo, hi) of [[en/concepts/bounds-propagation|Bounds Propagation]] and the path maximum of [[en/concepts/path-state|Path State]] both travel down this way.

With the depth as an extra parameter, pre-order can also rebuild the levels like [[en/concepts/breadth-first-search|BFS]]: a node at depth d goes into list d, and since left comes before right, the order within each level is still correct. Go right first instead, and the first node reaching each depth is the rightmost node of that level.

Without recursion, pre-order uses a [[en/concepts/stack|stack]]: pop a node, handle it, push the right child and then the left (so the left comes out first). Information carried down is pushed together with the node as a pair. This version handles deeply skewed trees that recursion cannot (see [[en/concepts/recursion-depth-limit|Recursion Depth Limit]]).

Read more in [[en/posts/2026-11-25-neetcode-level-order|station 5: Level Order and Carried State]].

Read more in [[en/posts/2026-11-26-neetcode-tree-reconstruction|station 6: Building and Serializing Trees]].
