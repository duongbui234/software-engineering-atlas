---
title: "Auxiliary Min Stack"
description: "Each stack level also stores the minimum up to that level, so getMin stays O(1) even after a pop."
tags: ["algorithms", "stack"]
type: note
region: Algorithms Region
lang: en
---

A single `min` variable breaks when you `pop` exactly the smallest element: you don't know the new min. Store pairs (value, min up to this level), or keep a parallel auxiliary stack, and after every `pop` the level below already holds the answer. It trades double the memory for O(1) on every operation. The same idea works for max, or any associative operation. See [[en/concepts/stack|Stack]].

Read more in [[en/posts/2026-11-23-neetcode-stack|station 6: Stack]].
