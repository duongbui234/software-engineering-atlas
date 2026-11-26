---
title: "Terminal Marker"
description: "A flag or stored value that identifies a trie node as a complete inserted word."
tags: [algorithms, tree, trie]
type: note
region: Algorithms Region
lang: en
---

In a [[en/concepts/trie|trie]] containing `cart`, I can reach `car` before it is stored as a word. A **terminal marker** can be a Boolean flag or the stored word itself. Inserting `car` marks the existing node and preserves the path to `cart`.

Read more in [[en/posts/2026-11-26-neetcode-trie|station 7: Tries]].
