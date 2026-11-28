---
title: "Duplicate Skipping"
description: "On a sorted array, equal values sit next to each other, so removing duplicates only takes a comparison with the previous element."
tags: ["algorithms"]
type: note
region: Algorithms Region
lang: en
---

When the problem wants results without repeats, the fastest tool is not a Set but **order**: after sorting, every duplicate sits next to its twin. Skip an element equal to the one **before** it (`a[i] == a[i − 1]`), not the one after, so the first occurrence is kept. After finding an answer, jump the pointer over the whole group of equal values. No string keys, no [[en/concepts/hash-set|Hash Set]].

Read more in [[en/problems/3sum|3Sum]].

In backtracking the condition becomes `i > start && a[i] == a[i − 1]`: skip a duplicate only when it sits next to its twin **on the same level** of the choice tree; going one level deeper may still take the next copy. See [[en/problems/subsets-ii|Subsets II]] and [[en/problems/combination-sum-ii|Combination Sum II]].
