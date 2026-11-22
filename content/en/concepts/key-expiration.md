---
title: "Key Expiration"
description: "How Redis deletes expired keys: when someone reads them, and with a sampling background cycle."
tags: ["caching", "redis"]
type: note
region: Cache Region
lang: en
---

**Key expiration** in Redis is passive (reading an expired key deletes it) plus active (a cycle driven by `hz` that samples keys with a TTL, tuned with `active-expire-effort`). Since Redis 7.4, each field of a hash can have its own TTL (`HEXPIRE`, `HTTL`).

Read more in [[en/posts/2026-11-22-caching-redis|Redis as a cache]].
