---
title: "Heap"
description: "A binary tree stored in an array with the smallest (or largest) element always at the top; insert and pop-top in O(log n)."
tags: ["algorithms", "data-structures"]
type: note
region: Algorithms Region
lang: en
---

A **heap** stores the parent at position i and its two children at 2i+1 and 2i+2. Inserting sifts up, popping the top sifts down, each operation O(log n). To get the top k largest, keep a min-heap with k spots: the top is the weakest candidate, pushed out when a stronger one arrives. Python has `heapq`, Go has `container/heap`, Java has `PriorityQueue`; JS has none built in.

Read more in [[en/problems/top-k-frequent-elements|Top K Frequent Elements]].
