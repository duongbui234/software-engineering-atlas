---
title: "Heapify"
description: "Build a heap from n existing elements in O(n) by sifting down from the last parent back to the root (Floyd, 1964), instead of n inserts costing O(n log n)."
tags: ["algorithms", "data-structures"]
type: note
region: Algorithms Region
lang: en
---

Inserting n elements one by one into an empty heap costs O(n log n): in the worst case (a descending sequence, for a min-heap) every element sifts up to the root. Floyd's **heapify** works the other way: treat the whole array as a tree, then sift down each slot from the last parent `n/2 − 1` back to slot 0. Half the slots are leaves and never move; a quarter sink at most 1 level, an eighth at most 2… At most n/2ʰ⁺¹ slots sit at height h, so the total number of swaps is at most Σ h · n/2ʰ⁺¹ = n: O(n). Measured on 10⁶ descending numbers: inserting one by one takes 17,951,445 swaps, heapify takes 999,988. Python has `heapq.heapify`, Go has `heap.Init`, Java has the `PriorityQueue(Collection)` constructor.

Read more in [[en/posts/2026-11-23-neetcode-heap-top-k|Heaps and Top K]].
