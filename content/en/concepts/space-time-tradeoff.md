---
title: "Space-Time Tradeoff"
description: "Use more memory to cut running time, or the other way around."
tags: ["algorithms", "complexity"]
type: note
region: Algorithms Region
lang: en
---

**Trading memory for time**: a hash set takes Contains Duplicate from O(n log n) to O(n), in exchange for O(n) memory for the elements already seen. When memory is a hard constraint (large data, a machine with little RAM), the slower in-place approach may be the right choice. Most of the optimizations in the Arrays & Hashing group are a trade like this.

Read more in [[en/problems/contains-duplicate|Contains Duplicate]].
