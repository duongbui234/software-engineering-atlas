---
title: "Pub/Sub Invalidation"
description: "Broadcasting a \"drop entry X\" message over a Pub/Sub channel so every pod deletes its local cache entry."
tags: ["caching", "messaging", "consistency"]
type: note
region: Cache Region
lang: en
---

**Pub/Sub invalidation** over Redis is at-most-once: messages are not stored, and a pod that is disconnected misses them. Harden it with a TTL on L1, clearing all of L1 on reconnect, periodic version checks, or a durable channel (Streams, a queue).

Read more in [[en/posts/2026-11-22-caching-distributed|Many tiers, many machines]].
