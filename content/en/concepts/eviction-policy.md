---
title: "Eviction Policy"
description: "The rule Redis uses to choose keys to evict when full: which group of keys, by which criterion."
tags: ["caching", "redis"]
type: note
region: Cache Region
lang: en
---

**maxmemory-policy** has 10 values in Redis 8: `noeviction` (the default, writes fail with OOM), `allkeys-` and `volatile-` combined with `lru`, `lfu`, `lrm` (8.6+), `random`, plus `volatile-ttl`. `volatile-*` behaves like `noeviction` when no keys with a TTL remain. For Redis used only as a cache, use `allkeys-lfu`/`allkeys-lru`.

Read more in [[en/posts/2026-11-22-caching-redis|Redis as a cache]].
