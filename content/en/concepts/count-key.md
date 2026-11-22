---
title: "Count Key"
description: "Use a frequency count table as the key instead of a sorted string."
tags: ["algorithms", "hashing"]
type: note
region: Algorithms Region
lang: en
---

A **count key** is built in O(k) instead of the sorted key's O(k log k). Measured with 10,000 words: 47 times faster when words are 1000 letters long, but slower when words are only 5 letters long, because it always has to build and join 26 numbers. The count table is an array, so it has to be converted into something that can be a key: a tuple (Python), a fixed-size array (Go), a string (JS, Java).

Read more in [[en/posts/2026-11-22-neetcode-group-anagrams|Group Anagrams]].
