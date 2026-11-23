---
title: "Sentinel Value"
description: "A fake element added at the start or end of the data so the loop needs no special handling for edge cases."
tags: ["algorithms", "stack"]
type: note
region: Algorithms Region
lang: en
---

In Largest Rectangle in Histogram, append a bar of height 0: it is shorter than every bar, so it empties the [[en/concepts/monotonic-stack|monotonic stack]] and computes the remaining bars' areas without a separate loop. The same idea: a dummy node at the head of a linked list, or `Infinity` as the starting value of a min search. The condition: the sentinel must never be a valid answer, or be an answer that cannot spoil the result.

Read more in [[en/posts/2026-11-23-neetcode-monotonic-stack|station 7: Monotonic Stack]].
