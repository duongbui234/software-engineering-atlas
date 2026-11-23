---
title: "K-way Merge"
description: "Merge k sorted lists into one: keep exactly one head (not yet taken) of each list in a heap, take the top, then push the next element of the same list; O(N log k) for N elements, and it can stop early when only the first m elements are needed."
tags: ["algorithms", "data-structures"]
type: note
region: Algorithms Region
lang: en
---

A **k-way merge** extends merge sort's two-way merge step to k lists. Instead of comparing all k heads at every step (O(k)), keep them in a heap of size k: take the top (the smallest, or the newest), then push the next element of the **same** list, O(log k) per step. The heap never holds more than k elements, so the total is O(N log k) with O(k) extra memory. It pays off most when only the first m elements are needed: stop after m takes, O(k + m log k), without touching the rest. The news feed of [[en/problems/design-twitter|Design Twitter (LC 355)]] is exactly this case: k followed users, one time-ordered tweet list each, and the 10 newest tweets wanted. Station 2 of [[en/series/neetcode-link|the Linked Structures Line]] reuses it to merge k linked lists.

Read more in [[en/posts/2026-11-24-neetcode-two-heaps|Two Heaps and Scheduling]]. See also [[en/concepts/heap|Heap]].
