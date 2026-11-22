---
title: "Frequency Counting"
description: "Count how many times each value appears, then answer the question on the count table."
tags: ["algorithms", "hashing"]
type: note
region: Algorithms Region
lang: en
---

**Frequency counting** turns questions like "same composition" (anagram) or "most frequent" (top k) into a comparison or a ranking over a count table. A Set only remembers "present or not"; a count table remembers "how many", so it can tell `aacc` apart from `ccac`. The count table can be an array (when the set of values is small and known in advance) or a hash map.

Read more in [[en/problems/valid-anagram|Valid Anagram]].
