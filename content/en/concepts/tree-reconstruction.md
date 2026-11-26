---
title: "Tree Reconstruction"
description: "Rebuild a tree's shape from traversal orders that carry enough information to distinguish its branches."
tags: [algorithms, tree, neetcode]
type: note
region: Algorithms Region
lang: en
---

**Tree reconstruction** recovers the values and the left and right positions of every node. With distinct values, [[en/concepts/pre-order-traversal|preorder]] supplies the next root and the [[en/concepts/inorder-interval|inorder interval]] tells me how to split the branches. If all I have is preorder and postorder and a node has exactly one child, those two traversals cannot tell me which side the child belongs to.

Read more in [[en/posts/2026-11-26-neetcode-tree-reconstruction|station 6: Building and Serializing Trees]].
