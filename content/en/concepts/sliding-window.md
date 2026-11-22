---
title: "Sliding Window"
description: "A contiguous range [left, right] whose two ends only move forward, to find the best range in O(n) instead of trying O(n²) ranges."
tags: ["algorithms"]
type: note
region: Algorithms Region
lang: en
---

A **sliding window** keeps a contiguous range `[left, right]`. The right end adds one element at a time; the left end moves forward when the window breaks the [[en/concepts/window-invariant|invariant]]. Since neither end moves back, each element enters and leaves the window at most once: O(n). The template only works when the problem is monotonic: if a range is bad, every longer range containing it is bad too. It does not work for finding a range with sum k in an array with negative numbers.

Read more in [[en/posts/2026-11-23-neetcode-sliding-window|Sliding Window]].
