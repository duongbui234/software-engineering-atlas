---
title: "Sift Up and Sift Down"
description: "The two operations that keep the heap property: a new element sifts up by swapping with its parent, a new top sifts down by swapping with its smaller child; each walks at most one path from leaf to root, O(log n)."
tags: ["algorithms", "data-structures"]
type: note
region: Algorithms Region
lang: en
---

In a min-heap stored in an array, the parent of slot i is `(i − 1) >> 1` and its children are `2i + 1` and `2i + 2`. **Sift up** is used on insert: put the new element at the end of the array, then swap it with its parent while it is smaller. **Sift down** is used on pop: move the last element into slot 0, then swap it with its smaller child while it is larger. It has to be the **smaller** child: swapping with the larger one would place the larger child above the smaller one and break the heap property. Both operations walk at most the height of the tree, ⌊log₂ n⌋ steps. Replacing the top with a new number and sifting down once (`heapq.heapreplace` in Python, `heap.Fix(h, 0)` in Go) is cheaper than pop then push, because it walks only one path.

Read more in [[en/posts/2026-11-23-neetcode-heap-top-k|Heaps and Top K]] and [[en/problems/kth-largest-element-in-a-stream|Kth Largest Element in a Stream (LC 703)]].
