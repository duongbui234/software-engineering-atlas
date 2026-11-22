---
title: "Fixed-size Window"
description: "A sliding window of fixed length k: each step adds one element on the right and removes one on the left."
tags: ["algorithms"]
type: note
region: Algorithms Region
lang: en
---

A **fixed-size window** of length k doesn't grow or shrink, it only slides: add `a[right]` and remove `a[right − k]` in the same step, no `while` loop needed. The window's state (count table, sum, queue) is updated twice per step instead of recomputed, so the total is O(n) instead of O(n·k). Permutation in String and Sliding Window Maximum use this kind of window.

Read more in [[en/posts/2026-11-23-neetcode-sliding-window|Sliding Window]].
