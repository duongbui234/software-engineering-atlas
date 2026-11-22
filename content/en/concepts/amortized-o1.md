---
title: "Amortized O(1)"
description: "An operation that is occasionally expensive, but spread over every call is still constant."
tags: ["algorithms", "complexity"]
type: note
region: Algorithms Region
lang: en
---

A hash table doubles when it fills up (Java at load factor 0.75, Python at about 2/3), and that growth has to copy every key, O(n). But because it doubles, the total number of copies after n writes stays under 2n, so on average each write is **amortized O(1)**. Measuring `Map.set` on V8: 100–250 ns per call even as n grows 4,000 times.

Read more in [[en/problems/two-sum|Two Sum]].
