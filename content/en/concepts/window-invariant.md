---
title: "Window Invariant"
description: "What a sliding window always satisfies after each step; the left end moves when it breaks."
tags: ["algorithms"]
type: note
region: Algorithms Region
lang: en
---

The **window invariant** is what holds at the end of every step: "no character repeats", "letters to replace ≤ k", "covers every letter of t". Choosing the right invariant is the hard part of each [[en/concepts/sliding-window|sliding window]] problem; the rest is the shared template. To find the longest, shrink until the invariant holds again and then update the answer; to find the shortest, shrink while the invariant still holds and update during the shrinking.

Read more in [[en/problems/longest-substring-without-repeating-characters|Longest Substring Without Repeating Characters]].
