---
title: "Binary Search"
description: "Search an ordered range by looking at the middle element and dropping half after every look; n elements need only about log₂ n looks."
tags: ["algorithms", "binary-search"]
type: note
region: Algorithms Region
lang: en
---

Keep a suspect range `[lo, hi]`. Each pass looks at `mid`, asks one yes/no question, and drops the half that cannot hold the answer. After k passes about n / 2ᵏ cells remain, so the total is O(log n): 20 looks for 10⁶ elements. The real requirement is not quite "a sorted array" but a question whose answer flips exactly once along the range; that is why it works on a rotated array. Correctness comes from a [[en/concepts/loop-invariant|loop invariant]] and one [[en/concepts/half-open-interval|range convention]] kept consistent; compute `mid` carefully to avoid [[en/concepts/midpoint-overflow|midpoint overflow]]. The variant without an early exit is the [[en/concepts/lower-bound|lower bound]]. It is the strongest form of [[en/concepts/search-space-pruning|search space pruning]].

Read more in [[en/posts/2026-11-23-neetcode-binary-search|station 1: Binary Search on Arrays]].
