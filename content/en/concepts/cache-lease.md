---
title: "Cache Lease"
description: "A token issued to whoever misses the cache; only the holder of a still-valid token may write to the cache."
tags: ["caching", "consistency", "concurrency"]
type: note
region: Cache Region
lang: en
---

A **lease** (Facebook's memcache, NSDI 2013) is a 64-bit token bound to a key; deleting the key invalidates the token, so a late write carrying an old token is rejected. Rate-limiting token issue (once every 10 seconds per key) also prevents thundering herds. In Redis it is built with an extra key and a Lua script.

Read more in [[en/posts/2026-11-22-caching-invalidation|Invalidation]].
