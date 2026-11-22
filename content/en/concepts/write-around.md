---
title: "Write-Around"
description: "Write straight to the database without touching the cache; the cache is filled only when someone reads."
tags: ["caching", "patterns"]
type: note
region: Cache Region
lang: en
---

**Write-around** keeps the cache free of write-once data that is rarely read again. The trap: an entry already in the cache returns the old value until its TTL runs out, so in practice it usually comes with a delete step, which is the write path of cache-aside.

Read more in [[en/posts/2026-11-22-caching-patterns|Read and write patterns]].
