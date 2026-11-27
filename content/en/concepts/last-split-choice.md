---
title: "Last Split Choice"
description: "Choose the action that happens last inside an interval, so the two sides of it become independent subproblems."
tags: [algorithms, neetcode, dynamic-programming]
type: note
region: Algorithms Region
lang: en
---

If I choose the first action in an interval, the rest usually stays entangled: bursting one balloon changes the neighbours on both sides. If I choose the last action, everything to its left and right is already done and never touches the other side, while the interval's two borders stay fixed. The two subproblems are then independent and combine with a sum.

Read more in [[en/posts/2026-11-27-neetcode-interval-dp|DP-07]] and on the [[en/problems/burst-balloons|Burst Balloons]] page.
