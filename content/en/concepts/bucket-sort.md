---
title: "Bucket Sort"
description: "Place elements into buckets by their own values, without using comparisons."
tags: ["algorithms", "sorting"]
type: note
region: Algorithms Region
lang: en
---

In Top K Frequent, frequencies always range from 1 to n, so you create n+1 buckets and drop each value into bucket `buckets[frequency]`: O(n), beating the O(n log n) bound of comparison sorting. But **bucket sort** allocates all n+1 buckets no matter how many distinct values there are; with a million numbers and only 1,000 distinct values, it is the slowest approach in the measurements.

Read more in [[en/problems/top-k-frequent-elements|Top K Frequent Elements]].
