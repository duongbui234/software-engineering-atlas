---
title: "Half-open Interval"
description: "The range [lo, hi) includes lo but not hi: its length is hi − lo, it is empty when lo == hi, and a result can be n with no special case."
tags: ["algorithms"]
type: note
region: Algorithms Region
lang: en
---

Many standard libraries use half-open ranges: Python's `range(lo, hi)` and `bisect`, Go's slice `s[lo:hi]`, C++'s `std::lower_bound`. In [[en/concepts/binary-search|binary search]], switching from the closed `[lo, hi]` to `[lo, hi)` changes exactly three places: `hi` starts at `n` instead of `n − 1`, the loop runs while `lo < hi` instead of `lo <= hi`, and dropping the right half is `hi = mid` instead of `hi = mid − 1`. Neither convention is more correct; bugs come from mixing them, for example initialising `hi = n − 1` and then looping on `lo < hi`, which skips the last cell. Edsger Dijkstra argued for this convention in his note EWD831, "Why numbering should start at zero".

Read more in [[en/posts/2026-11-23-neetcode-binary-search|station 1: Binary Search on Arrays]].
