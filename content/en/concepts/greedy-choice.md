---
title: "Greedy Choice"
description: "At each step take the option that looks best right now and never revisit it; correct only when an argument shows the choice cannot lose the optimal answer."
tags: [algorithms, neetcode, greedy]
type: note
region: Algorithms Region
lang: en
---

Greedy means that at each step I take what looks best right now and move on, without retrying old choices the way [[en/concepts/backtracking|backtracking]] does. It is fast because it makes one pass, but it is only correct when there is an argument that the local choice never rules out the best answer. Take change for 6 with coins {1, 3, 4}: greedy takes 4 + 1 + 1 (three coins) while 3 + 3 needs only two, which is why [[en/problems/coin-change|Coin Change]] needs DP.

Read more in [[en/posts/2026-11-28-neetcode-greedy-array|MISC-03]].
