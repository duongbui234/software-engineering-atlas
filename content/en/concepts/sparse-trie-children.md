---
title: "Sparse Trie Children"
description: "Use a character-keyed map to store the child edges that exist."
tags: [algorithms, tree, trie]
type: note
region: Algorithms Region
lang: en
---

When most [[en/concepts/trie|trie]] nodes have few children, I can use a map and allocate each edge when inserting. A fixed array reserves a slot per character at every node and allows direct indexing. Map overhead and runtime allocation determine which representation is smaller on real data.

Read more in [[en/posts/2026-11-26-neetcode-trie|station 7: Tries]].
