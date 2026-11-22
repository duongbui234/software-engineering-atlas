---
title: "Sorting Lower Bound"
description: "Every sorting algorithm based only on comparisons needs Ω(n log n) comparisons in the worst case."
tags: ["algorithms", "sorting", "complexity"]
type: note
region: Algorithms Region
lang: en
---

There are n! possible orders of n elements, and each comparison only halves the number of possibilities, so you need at least log₂(n!) ≈ n log n comparisons. That is the **lower bound of comparison sorting**. Non-comparison algorithms, such as bucket sort or counting sort, escape this bound when the keys are integers in a small, known range.

Read more in [[en/posts/2026-11-22-neetcode-top-k-frequent|Top K Frequent Elements]].
