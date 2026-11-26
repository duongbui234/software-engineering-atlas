---
title: "Trie Prefix Pruning"
description: "Stop a search branch when the dictionary has no edge for the next character."
tags: [algorithms, tree, trie]
type: note
region: Algorithms Region
lang: en
---

**Trie prefix pruning** keeps the current [[en/concepts/trie|trie]] node as a record of the matched path. When the next letter has no edge, every extension shares the same absent prefix, so I can abandon the branch. On a word board I still need [[en/concepts/backtracking|backtracking]] to keep each cell from appearing twice on the current path.

Read more in [[en/posts/2026-11-26-neetcode-trie|station 7: Tries]].
