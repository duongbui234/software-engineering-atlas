---
title: "Running Median"
description: "The median of a number stream, asked again after every new number; re-sorting or inserting into a sorted array costs O(n) each time, two heaps only O(log n), and when values fall in a small range a count array is cheaper still."
tags: ["algorithms"]
type: note
region: Algorithms Region
lang: en
---

The **running median** problem returns the median after every inserted number. Unlike the median of an array you already have (one O(n) quickselect, or a binary search on the cut position when there are two sorted arrays, as in [[en/problems/median-of-two-sorted-arrays|Median of Two Sorted Arrays]]), here the data arrives over time and the question repeats. Keeping a sorted array finds the insert position by binary search in O(log n), but the insert shifts everything after it, O(n): measured in [[en/problems/find-median-from-data-stream|LC 295]], 2·10⁵ numbers take about 1.4 seconds in TypeScript. [[en/concepts/two-heaps|Two heaps]] give O(log n) per insert and O(1) per query. If every value falls in a small range (say [0, 100]), count occurrences and walk the count array: O(1) per insert, O(range) per query. If old elements must also leave (a sliding window, LC 480), two heaps need lazy deletion: mark the numbers to drop and discard them only when they reach a top.

Read more in [[en/posts/2026-11-24-neetcode-two-heaps|Two Heaps and Scheduling]].
