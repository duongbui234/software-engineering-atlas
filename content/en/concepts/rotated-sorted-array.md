---
title: "Rotated Sorted Array"
description: "An increasing array cut at one point with its two parts swapped: two increasing runs back to back, still searchable by binary search."
tags: ["algorithms"]
type: note
region: Algorithms Region
lang: en
---

A **rotated sorted array** is an increasing array cut at an index k, with the part `[0, k)` moved to the back: `[0, 1, 2, 4, 5, 6, 7]` rotated at k = 4 becomes `[4, 5, 6, 7, 0, 1, 2]`. It is two increasing runs back to back with exactly **one** drop, and the drop is the minimum. Two consequences keep [[en/concepts/binary-search|binary search]] at O(log n): the question "`nums[i] <= nums[n − 1]`?" flips from "no" to "yes" exactly once (at the drop), and cutting any range in the middle leaves at least one half fully increasing. With duplicates, both consequences break when three cells are equal, and the worst case falls back to O(n).

Read more in [[en/problems/find-minimum-in-rotated-sorted-array|Find Minimum in Rotated Sorted Array]] and [[en/problems/search-in-rotated-sorted-array|Search in Rotated Sorted Array]].
