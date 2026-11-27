---
title: "LIS Minimum Tail"
description: "Keep the smallest ending value among increasing subsequences of equal length."
tags: [algorithms, neetcode, dynamic-programming]
type: note
region: Algorithms Region
lang: en
---

I keep one tail per length. Any value that extends a larger tail also extends the smaller one. Cells witness lengths independently, so they do not directly recover a valid sequence. For a new value, [[en/concepts/lower-bound|Lower Bound]] identifies the slot to update.

Read more in [[en/posts/2026-11-27-neetcode-word-break-lis|DP-04]].
