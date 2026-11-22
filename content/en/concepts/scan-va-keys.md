---
title: "SCAN and KEYS"
description: "KEYS walks the whole keyspace in one command and blocks Redis; SCAN walks it in batches with a cursor."
tags: ["caching", "redis"]
type: note
region: Cache Region
lang: en
---

**KEYS** is O(N) over all keys, and the Redis docs forbid it in application code. **SCAN** returns batches with a cursor and does not block other clients; it may return duplicates and may or may not see keys added or deleted midway. To delete a group of keys, designing versioned keys is better.

Read more in [[en/posts/2026-11-22-caching-redis|Redis as a cache]].
