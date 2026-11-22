---
title: "Write-Behind"
description: "Write only to the cache and reply immediately; the database is written later, in batches."
tags: ["caching", "patterns"]
type: note
region: Cache Region
lang: en
---

**Write-behind** (write-back) writes very fast and merges many writes to the same key into one. But until the flush, the cache is the only source of truth: a crash loses data, and DB constraint errors show up after success was already reported. Use it only for data that can tolerate losing a little (counters, statistics).

Read more in [[en/posts/2026-11-22-caching-patterns|Read and write patterns]].
