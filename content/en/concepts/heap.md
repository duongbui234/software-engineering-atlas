---
title: "Heap"
description: "A binary tree stored in an array with the smallest (or largest) element always at the top; insert and pop-top in O(log n)."
tags: ["algorithms", "data-structures"]
type: note
region: Algorithms Region
lang: en
---

A **heap** stores the parent at position i and its two children at 2i+1 and 2i+2. Inserting sifts up, popping the top sifts down, each operation O(log n). To get the top k largest, keep a min-heap with k spots: the top is the weakest candidate, pushed out when a stronger one arrives. Python has `heapq`, Go has `container/heap`, Java has `PriorityQueue`; JS has none built in.

Insert, pop and building a heap in O(n) have their own notes: [[en/concepts/sift-up-sift-down|Sift Up and Sift Down]], [[en/concepts/heapify|Heapify]], [[en/concepts/size-k-heap|Size-K Heap]].

Read more in [[en/problems/top-k-frequent-elements|Top K Frequent Elements]] and the station [[en/posts/2026-11-23-neetcode-heap-top-k|Heaps and Top K]].

Two heaps side by side give the median of a stream, and one heap of size k merges k sorted lists: see the station [[en/posts/2026-11-24-neetcode-two-heaps|Two Heaps and Scheduling]], [[en/concepts/two-heaps|Two Heaps]], [[en/concepts/k-way-merge|K-way Merge]].
