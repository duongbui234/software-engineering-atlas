---
title: "Size-K Heap"
description: "To keep the k largest elements of a stream, use a min-heap of at most k slots: the top is the weakest candidate and also the k-th largest; each element costs O(log k), memory O(k)."
tags: ["algorithms", "data-structures"]
type: note
region: Algorithms Region
lang: en
---

For the k **largest** numbers you use a **min**-heap. It sounds backwards but it is right: the heap keeps the k best candidates seen so far, and the only question for each new number is "is it stronger than the **weakest** candidate?". The weakest candidate has to sit at the top to be compared in O(1), so it is a min-heap. Stronger: replace the top and sift down, O(log k); weaker: drop it. Memory stays at k slots however long the stream is, and the top is always the k-th largest. For the k **smallest** (the k points closest to the origin) flip it: a max-heap of k slots whose top is the farthest candidate. The common mistakes are picking the wrong heap direction, so the heap keeps the k smallest numbers, or forgetting to trim when the heap goes past k, so the top becomes the smallest number of the whole stream.

Read more in [[en/posts/2026-11-23-neetcode-heap-top-k|Heaps and Top K]], [[en/problems/kth-largest-element-in-a-stream|Kth Largest Element in a Stream (LC 703)]] and [[en/problems/kth-largest-element-in-an-array|Kth Largest Element in an Array (LC 215)]].
