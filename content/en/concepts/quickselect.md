---
title: "Quickselect"
description: "Partition like quicksort but continue into only one side, to find the k-th element in O(n) on average."
tags: ["algorithms", "sorting"]
type: note
region: Algorithms Region
lang: en
---

**Quickselect** picks a random pivot, partitions, then continues only on the side that contains position k: on average m + m/2 + … ≈ 2m steps. The worst case is O(m²). When very many values are equal, a two-way partition with `<` degenerates: the measurement gives 798 ms against 228 ms for sorting. A three-way partition (less than, equal to, greater than the pivot) fixes it.

Read more in [[en/posts/2026-11-22-neetcode-top-k-frequent|Top K Frequent Elements]].
