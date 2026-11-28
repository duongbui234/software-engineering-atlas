---
title: "Smallest-First Grouping"
description: "When cards must be split into groups of consecutive values, the smallest remaining card can only open a group, so the group is opened there without trying alternatives."
tags: [algorithms, neetcode, greedy]
type: note
region: Algorithms Region
lang: en
---

The smallest remaining card has no smaller card before it, so it cannot sit in the middle or at the end of a consecutive group: it must open a group `x, x + 1, …, x + k − 1`. A forced choice needs no retrying, which is why the [[en/concepts/greedy-choice|greedy choice]] is safe here. I sort the values, count the cards of each, then repeat: take the smallest value that still has cards, remove one group, and fail as soon as a value in the middle is missing.

Read more in [[en/posts/2026-11-28-neetcode-greedy-grouping|MISC-04]].
