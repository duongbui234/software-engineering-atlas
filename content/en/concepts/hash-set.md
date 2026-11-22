---
title: "Hash Set"
description: "A set that uses hashing to answer \"is x in here?\" in O(1) average time."
tags: ["algorithms", "hashing"]
type: note
region: Algorithms Region
lang: en
---

A **hash set** computes an element's hash to know which bucket it must be in, then looks only at that bucket, so lookup and insert take O(1) on average. JS/TS has `Set` (keys compared with SameValueZero), Python has `set`, Java has `HashSet` (a `HashMap` inside), and Go uses `map[T]struct{}`. Write the loop with `has` then `add` so it stops as soon as it meets a duplicate.

Read more in [[en/posts/2026-11-22-neetcode-contains-duplicate|Contains Duplicate]].
