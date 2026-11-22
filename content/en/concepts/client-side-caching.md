---
title: "Client-side Caching"
description: "Redis 6+ remembers which keys a client has read and sends an invalidation message when one of them changes."
tags: ["caching", "redis"]
type: note
region: Cache Region
lang: en
---

**Client-side caching** (`CLIENT TRACKING`) has a default mode (remembers each key, costs server memory) and a broadcast mode (by prefix, no memory cost). RESP2 needs `REDIRECT` to a connection subscribed to `__redis__:invalidate`; there are `OPTIN`, `OPTOUT`, `NOLOOP`. When the connection drops, flush the local cache entirely.

Read more in [[en/posts/2026-11-22-caching-distributed|Many tiers, many machines]].
