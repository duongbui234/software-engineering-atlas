---
title: "Bloom Filter"
description: "A small bit array that answers \"definitely not present\" or \"might be present\" for an element."
tags: ["caching", "data-structures"]
type: note
region: Cache Region
lang: en
---

A **Bloom filter** (1970) uses `m` bits and `k` hash functions; it has no false negatives, and its false positive rate is about `(1 − e^(−kn/m))^k`. 1% needs about 9.6 bits per element: 10,000 ids take about 12 KB. Elements cannot be deleted (use a counting Bloom filter or a cuckoo filter). Redis 8 ships `BF.ADD`, `BF.EXISTS`.

Read more in [[en/posts/2026-11-22-caching-under-load|Caching under heavy load]].
