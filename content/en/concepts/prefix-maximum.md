---
title: "Prefix Maximum"
description: "L[i] = the largest value from the start of the array up to i, computed in one pass with a running variable."
tags: ["algorithms"]
type: note
region: Algorithms Region
lang: en
---

The **prefix maximum** `L[i] = max(h[0..i])` takes one pass: `L[i] = max(L[i − 1], h[i])`. Going from the right gives the suffix maximum. It is the same template as prefix sums and prefix products with a different operation; in Python it is just `accumulate(h, max)`. When each position only needs the maxima on both sides **at the moment** it is examined, [[en/concepts/two-pointers|two pointers]] replace the two arrays with two variables.

Read more in [[en/problems/trapping-rain-water|Trapping Rain Water]].
