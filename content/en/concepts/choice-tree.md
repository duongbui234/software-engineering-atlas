---
title: "Choice Tree"
description: "A tree whose nodes are partial solutions and whose edges are choices; backtracking is a depth-first walk of this tree."
tags: [algorithms, neetcode, backtracking]
type: note
region: Algorithms Region
lang: en
---

I draw the root as the empty solution, each edge down as one more choice, and the path from the root to a node as the `path` I am holding. Backtracking walks this tree depth first: going down an edge is choosing, coming back up is undoing. Counting the tree's nodes is the quickest way to estimate the running time; the subset tree of n elements has 2ⁿ nodes.

Read more in [[en/posts/2026-11-28-neetcode-subsets-combinations|MISC-01]] and on the [[en/problems/subsets|Subsets]] page.
