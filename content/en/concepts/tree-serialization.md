---
title: "Tree Serialization"
description: "Encode a tree's values and shape in data that can be stored and read back."
tags: [algorithms, tree, neetcode]
type: note
region: Algorithms Region
lang: en
---

To **serialize a tree**, I pick a traversal order and a representation that carries enough information to rebuild every edge. Preorder, for example, records the root value and then both subtrees, using a [[en/concepts/null-marker|null marker]] for an empty tree. A round-trip test checks both shape and values because two shapes can have the same sequence of traversal values.

Read more in [[en/posts/2026-11-26-neetcode-tree-reconstruction|station 6: Building and Serializing Trees]].
