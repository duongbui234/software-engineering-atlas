---
title: "Big-O Notation"
description: "A way to describe how the number of steps or the memory grows as the input size n grows, ignoring constants."
tags: ["algorithms", "complexity"]
type: note
region: Algorithms Region
lang: en
---

**Big-O** describes the shape of the cost curve: O(n²) means that when n grows 10 times, the work grows about 100 times. It ignores constants and lower-order terms, so it does not tell you how many milliseconds an algorithm takes. Two O(n) approaches can differ by a large factor, and an O(n) approach can be slower than an O(n log n) one at every input size you actually meet. Measure with a clock to check.

Read more in [[en/posts/2026-11-22-neetcode-contains-duplicate|Contains Duplicate]].
