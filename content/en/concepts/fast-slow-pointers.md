---
title: "Fast and Slow Pointers"
description: "Two pointers walking the same list, one a step at a time and the other two steps; used to detect a cycle (Floyd's algorithm) and to find the middle node in one pass with O(1) memory."
tags: ["algorithms", "data-structures"]
type: note
region: Algorithms Region
lang: en
---

The **slow pointer** moves one step per iteration, the **fast pointer** two. Two uses follow directly:

- **Cycle detection** (Floyd's algorithm, also "tortoise and hare"): without a cycle the fast pointer reaches `null`; with one, once both are inside the cycle the gap between them shrinks by exactly 1 per iteration, so the fast pointer catches the slow one within one lap. It needs two variables, while remembering visited nodes in a set needs O(n) memory.
- **Finding the middle**: when the fast pointer reaches the end, the slow one stands in the middle, since it has covered half the distance.

Compare **the same node** (`===`, `is`, `==` on pointers), not values: two different nodes can hold the same value.

Read more in [[en/posts/2026-11-24-neetcode-linked-list|Linked List Pointers]], [[en/problems/linked-list-cycle|Linked List Cycle]] and [[en/problems/reorder-list|Reorder List]]. See also [[en/concepts/two-pointers|Two Pointers]].
