---
title: "Two Heaps"
description: "Split the data into a lower half in a max-heap and an upper half in a min-heap; the two tops sit right at the boundary, so the middle element (the median) is readable in O(1) and each insert costs only O(log n)."
tags: ["algorithms", "data-structures"]
type: note
region: Algorithms Region
lang: en
---

**Two heaps** keep two invariants: (1) every number in the lower half is no larger than every number in the upper half, and (2) the two halves have the same size or the lower half has one more. The lower half is a **max**-heap, so its top is the largest number below the boundary; the upper half is a **min**-heap, so its top is the smallest number above it. The two tops sit side by side in the middle of the sorted order, even though neither heap is sorted. To add a number: push it into the lower half, move the lower top to the upper half (keeps invariant 1), and if the upper half is now bigger, move its top back (keeps invariant 2): at most three O(log n) operations. Reading the median reads one or two tops, O(1). The common mistakes keep only invariant 2 (alternating between heaps) or only invariant 1 (never rebalancing): both give wrong medians.

Read more in [[en/posts/2026-11-24-neetcode-two-heaps|Two Heaps and Scheduling]] and [[en/problems/find-median-from-data-stream|Find Median from Data Stream (LC 295)]]. See also [[en/concepts/heap|Heap]], [[en/concepts/running-median|Running Median]].
