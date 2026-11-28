---
title: "Safe Candidate Filter"
description: "Discard every candidate that exceeds the target in any component, since using it fails immediately; among the rest, merging all of them can only help, never hurt."
tags: [algorithms, neetcode, greedy]
type: note
region: Algorithms Region
lang: en
---

Merging takes the max of each component, so values only go up. A candidate with a component above the target pushes past it for good once merged, so I drop it. The remaining candidates cannot push any component past the target, so merging all of them is the best possible move: if the safe set reaches the target in all three components the answer is yes, and otherwise no combination can.

Read more in [[en/posts/2026-11-28-neetcode-greedy-grouping|MISC-04]].
