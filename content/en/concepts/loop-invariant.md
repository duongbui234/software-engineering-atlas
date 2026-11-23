---
title: "Loop Invariant"
description: "A statement that holds before and after every pass of a loop; write it down first and the loop condition, the variable updates and the meaning of the exit all follow."
tags: ["algorithms"]
type: note
region: Algorithms Region
lang: en
---

An invariant is used in three steps: it holds at initialisation, each pass keeps it true, and when the loop stops it combines with the exit condition to give the result you want. For [[en/concepts/binary-search|binary search]] the invariant is "if `target` is present, it lies in `[lo, hi]`": initialising `lo = 0, hi = n − 1` makes it true; `lo = mid + 1` keeps it because every dropped cell is smaller than `target`; exiting with an empty range means `target` is absent. Writing code by flipping `<` to `<=` until the tests pass is a sign there is no invariant yet. The same idea appeared as the sliding window's [[en/concepts/window-invariant|window invariant]].

Read more in [[en/posts/2026-11-23-neetcode-binary-search|station 1: Binary Search on Arrays]].
