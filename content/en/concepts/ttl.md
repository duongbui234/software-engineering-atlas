---
title: "TTL"
description: "How long a cache entry lives; it caps the maximum time the cache can be wrong."
tags: ["caching", "redis"]
type: note
region: Cache Region
lang: en
---

**TTL** is the safety net for every kind of invalidation: if a delete is forgotten or a race happens, the wrong entry still disappears on its own. In Redis: `SET ... EX`, `EXPIRE`, `TTL` (−1 no expiry, −2 does not exist). `SET` without `EX`/`KEEPTTL` clears the old TTL; `GET` does not extend it, so to extend on read use `GETEX`.

Read more in [[en/posts/2026-11-22-caching-invalidation|Invalidation]].
