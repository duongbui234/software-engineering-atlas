---
title: "Two Pointers"
description: "Two indices moving in from both ends of a sorted array, each step eliminating one element."
tags: ["algorithms"]
type: note
region: Algorithms Region
lang: en
---

On an ascending array, **two pointers** start at the beginning and the end: if the sum is too small, move the left pointer; if it is too large, move the right pointer. Each step eliminates one element, so it is O(n) in total with O(1) space. If the array is not sorted, that costs an extra O(n log n), and you must sort the indices to keep the original positions. In JS, the default `sort()` compares strings and makes two pointers miss the answer.

Read more in [[en/problems/two-sum|Two Sum]].
