---
title: "Farthest Reach"
description: "The farthest index reachable so far; because reachable cells always form a contiguous block from the start, this one number replaces a whole array of flags."
tags: [algorithms, neetcode, greedy]
type: note
region: Algorithms Region
lang: en
---

In the jump problems, if cell j is reachable then every cell before j is too, since any path of jumps passes over or lands on them. So the reachable set is always a block `[0, reach]`, and I only keep `reach = max(reach, i + nums[i])` as I pass each cell. Meeting a cell with `i > reach` means a gap that cannot be crossed.

Read more in [[en/posts/2026-11-28-neetcode-greedy-array|MISC-03]].
