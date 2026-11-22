---
title: "k-Sum Reduction"
description: "Solve a find-k-numbers-with-a-given-sum problem by fixing k − 2 numbers and running two pointers for the last two."
tags: ["algorithms"]
type: note
region: Algorithms Region
lang: en
---

A k-number problem reduces to a (k − 1)-number one: fix a number `a`, then look for k − 1 numbers summing to `target − a` in the part to its right. Repeat until two numbers are left, then use [[en/concepts/two-pointers|two pointers]] on the sorted array. 3Sum becomes O(n²), 4Sum O(n³), and in general O(n^(k−1)). Sorting once at the start also enables [[en/concepts/duplicate-skipping|duplicate skipping]] without a Set.

Read more in [[en/problems/3sum|3Sum]].
