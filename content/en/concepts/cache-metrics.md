---
title: "Cache Metrics"
description: "Numbers that tell you whether the cache is hitting, whether it is short on room, and whether it is taking load off the source."
tags: ["caching", "observability"]
type: note
region: Cache Region
lang: en
---

**Cache metrics**: hit ratio per cache (counted in the application, because Redis's `keyspace_hits` lumps every key together), `evicted_keys`, `expired_keys`, memory against `maxmemory`, command latency, load time on a miss, and the load the database receives.

Read more in [[en/posts/2026-11-22-caching-operations|Operations and security]].
