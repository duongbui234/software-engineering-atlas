---
title: "Lower Bound"
description: "The first position whose value is >= target in a sorted array (bisect_left, std::lower_bound, sort.Search); also where target can be inserted to keep the array sorted."
tags: ["algorithms", "binary-search"]
type: note
region: Algorithms Region
lang: en
---

[[en/concepts/binary-search|Binary search]] without an early exit: on a [[en/concepts/half-open-interval|half-open range]] `[lo, hi)`, when `nums[mid] < target` set `lo = mid + 1`, otherwise `hi = mid` (keep `mid`, since it may be the answer). Invariant: every cell before `lo` is smaller than `target`, every cell from `hi` on is greater than or equal. When `lo == hi`, that is the boundary, possibly `n`. The upper bound (`bisect_right`, `upper_bound`) is the first position `> target`; the difference of the two bounds counts how often `target` appears. Java's `Arrays.binarySearch` returns `-(insertion point) − 1` when absent, and does not guarantee the first cell when there are duplicates.

Read more in [[en/problems/binary-search|Binary Search (LC 704)]] and [[en/posts/2026-11-23-neetcode-binary-search|station 1: Binary Search on Arrays]].

For a strictly increasing subsequence, I use this boundary to replace a tail that is equal to the incoming value. That preserves the current length. [[en/posts/2026-11-27-neetcode-word-break-lis|DP-04]].
