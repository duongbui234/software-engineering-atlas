---
title: "Cache-Aside"
description: "The application reads the cache itself, reads the DB on a miss and writes the result to the cache; on writes it writes the DB first and then deletes the cache entry."
tags: ["caching", "patterns"]
type: note
region: Cache Region
lang: en
---

**Cache-aside** (lazy loading) is the default pattern: the cache sits to the side and knows nothing about the database. Delete rather than update the cache on writes, because deleting is idempotent. There is still one rare gap, the stale set race.

Read more in [[en/posts/2026-11-22-caching-patterns|Read and write patterns]].
