---
title: "Hash Map"
description: "A key → value table that uses hashing for O(1) average lookups."
tags: ["algorithms", "hashing"]
type: note
region: Algorithms Region
lang: en
---

A **hash map** is a hash set with a value attached to each key: a count, a position, a list. JS/TS has `Map` (keeps the key's type, unlike a plain object), Python has `dict`, Go has `map`, Java has `HashMap`. Keys must be "hashable" and compared by contents; arrays in JS and Java are compared by identity, and lists in Python are not hashable.

Read more in [[en/posts/2026-11-22-neetcode-valid-anagram|Valid Anagram]].
