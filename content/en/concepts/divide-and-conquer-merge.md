---
title: "Divide-and-Conquer Merge"
description: "Merge k sorted sequences by merging them in pairs, halving the count each round: log k rounds, each touching every element once, O(N log k) without a heap."
tags: ["algorithms"]
type: note
region: Algorithms Region
lang: en
---

You have k sorted sequences with N elements in total. Merging them one by one into a single result costs O(N · k), because the result keeps growing and the early elements get walked over k times. **Divide-and-conquer merge** merges like a knockout tournament: round 1 merges sequence 0 with 1, 2 with 3, …; the next round merges those results, until one remains. There are ⌈log₂ k⌉ rounds and each round touches every element exactly once, so the total is O(N log k), the same as using a [[en/concepts/heap|heap]] in a [[en/concepts/k-way-merge|k-way merge]], but it only needs a two-way merge function. It is also the "merge" step of merge sort, run bottom-up.

Used in [[en/problems/merge-k-sorted-lists|Merge k Sorted Lists]]: with 1,000 lists × 100 nodes, pairwise merging takes 8.3 ms and merging one by one takes 287.1 ms. A heap fits better when the sequences arrive as streams, or when you only need the first few smallest elements.

Read more in [[en/posts/2026-11-24-neetcode-advanced-linked-list|Advanced Linked Lists]].
