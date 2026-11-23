---
title: "Search on the Answer"
description: "Binary search not over an array but over the range of possible answers, driven by a yes/no question that flips exactly once: the slowest speed, the smallest capacity, the earliest time."
tags: ["algorithms", "binary-search"]
type: note
region: Algorithms Region
lang: en
---

When a problem asks for "the **smallest** (or largest) value that still lets you do X", the answer is a number inside a known range `[lo, hi]`, and often there is no array to search at all. If checking "with value k, can X be done?" is easier than finding k directly, and the answer is a [[en/concepts/monotonic-predicate|monotonic predicate]] (no, no, …, yes, yes), then [[en/concepts/binary-search|binary search]] over the answer range finds the boundary in about log₂(hi − lo) checks. The template is the [[en/concepts/lower-bound|lower bound]]: in time means `hi = mid` (keep `mid`), too slow means `lo = mid + 1`. The cost is log₂(hi − lo) times the cost of one check, usually O(n log max).

Read more in [[en/problems/koko-eating-bananas|Koko Eating Bananas (LC 875)]] and [[en/posts/2026-11-23-neetcode-binary-search-answer|station 2: Binary Search on the Answer]].
