---
title: "One-pass Hash Map"
description: "Walk the data once, and at each step look up the map first, then store the current element."
tags: ["algorithms", "hashing"]
type: note
region: Algorithms Region
lang: en
---

In a **one-pass hash map**, the map only holds the elements before the current position. Ask first, store second, and an element is never paired with itself: `[3, 3]` with target 6 gives `[0, 1]`. Swapping the order (store first, then ask) makes `[3, 2, 4]` with target 6 return `[0, 0]`.

Read more in [[en/posts/2026-11-22-neetcode-two-sum|Two Sum]].
