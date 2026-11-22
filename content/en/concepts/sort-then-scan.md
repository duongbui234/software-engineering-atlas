---
title: "Sort Then Scan"
description: "Sort first so equal values sit next to each other, then compare only adjacent elements."
tags: ["algorithms", "sorting"]
type: note
region: Algorithms Region
lang: en
---

**Sort then scan** turns a question about every pair into a question about adjacent pairs, at the O(n log n) cost of the sorting step. Auxiliary space is nearly zero when sorting in place, but then the caller's input gets modified. In JS you must pass a comparator: the default `sort()` compares elements as strings.

Read more in [[en/posts/2026-11-22-neetcode-contains-duplicate|Contains Duplicate]].
