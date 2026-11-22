---
title: "Fail-open"
description: "When the cache errors, treat it as a miss and read the source directly instead of failing the request."
tags: ["caching", "reliability"]
type: note
region: Cache Region
lang: en
---

**Fail-open** is right for a true cache (everything can be reloaded), but it needs a short timeout, the client's offline queue turned off (ioredis hangs requests by default), a circuit breaker, and a database that can cope when the hit ratio drops to 0. Primary data (sessions, locks) should fail closed.

Read more in [[en/posts/2026-11-22-caching-operations|Operations and security]].
