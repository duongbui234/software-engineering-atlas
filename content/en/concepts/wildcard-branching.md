---
title: "Wildcard Branching"
description: "Explore multiple child edges when one pattern character admits several matches."
tags: [algorithms, tree, trie]
type: note
region: Algorithms Region
lang: en
---

In a query where `.` matches one letter, I try each existing [[en/concepts/trie|trie]] edge and advance the pattern index once per choice. A successful branch consumes the pattern at a [[en/concepts/terminal-marker|marked node]]. The work depends on which edges are actually explored, especially when a dot appears near the root.

Read more in [[en/posts/2026-11-26-neetcode-trie|station 7: Tries]].
