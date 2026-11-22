---
title: "Monotonic Deque"
description: "A double-ended queue keeping indices in decreasing order of value, giving the max of a sliding window in O(1)."
tags: ["algorithms"]
type: note
region: Algorithms Region
lang: en
---

A **monotonic deque** keeps element indices in decreasing order of value. A new element pushes out every element at the back that is smaller or equal, since they can never be the max while the new one is in the window; the front is dropped once it slides out. The front is always the window's max, and each index enters and leaves once, so the total is O(n). It needs O(1) add and remove at both ends: `deque` in Python, `ArrayDeque` in Java; a JS array's `shift()` is O(n).

Read more in [[en/posts/2026-11-23-neetcode-sliding-window|Sliding Window]].
