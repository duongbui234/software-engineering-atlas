---
title: "Trie"
description: "A tree that shares paths between strings with common prefixes."
tags: [algorithms, tree, trie]
type: note
region: Algorithms Region
lang: en
---

A **trie** starts at an empty root and adds one character along each edge. A node represents the prefix read on the path from the root. I use a [[en/concepts/terminal-marker|terminal marker]] to record a prefix that is also a stored word, while its children still lead to longer words.

Read more in [[en/posts/2026-11-26-neetcode-trie|station 7: Tries]].
