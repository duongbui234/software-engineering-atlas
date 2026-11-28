---
title: "Last Occurrence Boundary"
description: "A part of the string must extend to the last occurrence of every letter inside it; when the current index reaches that farthest mark, the part can be cut right there."
tags: [algorithms, neetcode, greedy]
type: note
region: Algorithms Region
lang: en
---

I record in advance the last position of each letter. Walking left to right, each letter pushes the mark `end = max(end, last[c])`, because the current part must contain all of that letter. When `i == end`, no letter of this part appears later, so cutting here is valid, and cutting as early as possible gives the most parts. It is the same idea as [[en/concepts/farthest-reach|farthest reach]] from the previous station: one number stands in for a whole set of constraints.

Read more in [[en/posts/2026-11-28-neetcode-greedy-grouping|MISC-04]].
