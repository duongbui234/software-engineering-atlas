---
title: "Restart Argument"
description: "The argument that when a run from start fails at i, every start between start and i fails too, so the search can jump straight to i + 1."
tags: [algorithms, neetcode, greedy]
type: note
region: Algorithms Region
lang: en
---

Walking from `start`, I keep a running sum and it first goes negative at `i`. Every point `k` between `start` and `i` has a non-negative prefix `[start, k)`, because the sum never went negative before `i`. Removing that non-negative part can only make the sum from `k` to `i` smaller or equal, so it is negative too. So I skip the whole stretch and restart at `i + 1`. This is why [[en/concepts/kadane-algorithm|Kadane]] and [[en/problems/gas-station|Gas Station]] need only one pass.

Read more in [[en/posts/2026-11-28-neetcode-greedy-array|MISC-03]].
