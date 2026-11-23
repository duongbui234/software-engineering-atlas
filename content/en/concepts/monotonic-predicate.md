---
title: "Monotonic Predicate"
description: "A yes/no question p(k) that, once true at k, stays true for every larger value: along the range the answer flips from false to true exactly once, so binary search can find the boundary."
tags: ["algorithms", "binary-search"]
type: note
region: Algorithms Region
lang: en
---

A predicate is a function that returns true or false. It is **monotonic** when p(k) true implies p(k + 1) true: the sequence p(lo), p(lo + 1), …, p(hi) reads false…false true…true. This is the real requirement of [[en/concepts/binary-search|binary search]], broader than "the array is sorted": a sorted array gives the predicate `nums[i] >= target`, a rotated array gives `nums[i] <= nums[n − 1]`, and Koko gives "speed k finishes within h hours". Standard libraries take the predicate directly: Go `sort.Search(n, f)`, Python `bisect_left(range, True, key=f)` (3.10+), C++ `std::partition_point`, Rust `partition_point`. If the predicate flips more than once, binary search still runs and returns **some** boundary without any error, so prove monotonicity first.

Read more in [[en/problems/koko-eating-bananas|Koko Eating Bananas (LC 875)]] and [[en/posts/2026-11-23-neetcode-binary-search-answer|station 2: Binary Search on the Answer]].
