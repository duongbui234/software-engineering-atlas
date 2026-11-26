---
title: "Null Marker"
description: "A reserved token that records an empty position in a tree's representation."
tags: [algorithms, tree, neetcode]
type: note
region: Algorithms Region
lang: en
---

A **null marker** tells the reader that a child slot holds no node, such as `#` in a [[en/concepts/tree-serialization|serialized tree]]. I emit markers in the chosen traversal order, so `8,#,3,#,#` differs from `8,3,#,#,#` even though both contain nodes 8 and 3. A null marker has to be distinguishable from every valid node value.

Read more in [[en/posts/2026-11-26-neetcode-tree-reconstruction|station 6: Building and Serializing Trees]].
