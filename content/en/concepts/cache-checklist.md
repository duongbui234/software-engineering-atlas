---
title: "Cache Checklist"
description: "A checklist before putting a cache into production, pulling together the whole Caching line."
tags: ["caching", "operations"]
type: note
region: Cache Region
lang: en
---

**Cache checklist**: should you cache at all, a complete and normalized key, explicit `Cache-Control`, the right write pattern, a TTL on every entry and complete deletes, protection against stampedes and penetration, `maxmemory` and a policy, a TTL on L1, measuring per cache, fail-open that accounts for database load, no unkeyed input.

Read more in [[en/posts/2026-11-22-caching-operations|Operations and security]].
