---
title: "Kadane's Algorithm"
description: "Find the largest sum of a contiguous subarray in one pass: keep the best sum of a subarray ending at the current position, and drop the old run as soon as it makes the sum smaller than the new element alone."
tags: [algorithms, neetcode, greedy]
type: note
region: Algorithms Region
lang: en
---

I walk left to right and keep `cur`, the best sum of a subarray that ends exactly where I stand: `cur = max(x, cur + x)`. If the old tail is negative, attaching it only lowers the sum, so I drop it and start again from `x`. The answer is the largest value `cur` ever reaches, in O(n) time and O(1) memory.

Read more in [[en/posts/2026-11-28-neetcode-greedy-array|MISC-03]].
