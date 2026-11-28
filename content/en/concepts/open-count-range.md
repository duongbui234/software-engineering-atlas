---
title: "Open Count Range"
description: "Instead of trying every reading of the wildcard, keep the range [lo, hi] of possible unmatched open brackets; since that set is always contiguous, two numbers are enough."
tags: [algorithms, neetcode, greedy]
type: note
region: Algorithms Region
lang: en
---

Each `(` adds 1, each `)` subtracts 1, and `*` may be `(`, `)` or empty, so it adds, subtracts or keeps. The set of possible open counts after each character is always a contiguous range, so I keep only its ends: `lo` (fewest open brackets) and `hi` (most). If `hi < 0` there are too many `)`, and it fails at once. `lo` cannot go below zero because an open count is never negative, so I clamp it to 0. At the end, `lo == 0` means some reading closes every bracket.

Read more in [[en/posts/2026-11-28-neetcode-greedy-grouping|MISC-04]].
