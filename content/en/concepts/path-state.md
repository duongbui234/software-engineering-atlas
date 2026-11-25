---
title: "Path State"
description: "One value that sums up the whole path from the root to the current node, such as the largest value seen so far, carried down with the node instead of keeping the whole path."
tags: ["algorithms", "tree", "recursion"]
type: note
region: Algorithms Region
lang: en
---

Many tree questions are about **the path from the root to a node**: is this node at least as large as every ancestor, what is the sum along the path, has the path passed some value. The direct way is to keep the whole path and rescan it at each node, costing O(n·h). A **path state** is one value that is enough to answer the question, updated at each step down: for Count Good Nodes it is the largest value seen so far, so one comparison suffices and the total cost drops to O(n).

The state travels with the node. In a recursive [[en/concepts/pre-order-traversal|pre-order traversal]] it is a parameter; in a loop it is the second half of a (node, state) pair on the stack or in the queue. Because each call has its own copy, the left branch updating the state cannot spoil the right branch.

The common trap is comparing only with the parent, a state that is only one step long: on the station's 300 random trees, that approach miscounts 255. [[en/concepts/bounds-propagation|Bounds Propagation]] is another path state, made of two numbers.

Read more in [[en/posts/2026-11-25-neetcode-level-order|station 5: Level Order and Carried State]].
