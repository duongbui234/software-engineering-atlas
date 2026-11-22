---
title: "Cache Stampede"
description: "A hot key expires, and every request during the reload misses and goes to ask the source together."
tags: ["caching", "reliability", "performance"]
type: note
region: Cache Region
lang: en
---

**Cache stampede** (dogpile, thundering herd): at 5,000 requests/second and a 100 ms reload, that is about 500 duplicate queries. A slower source makes the window longer, turning into a vicious spiral. Cure it with request coalescing, probabilistic early expiration, leases.

Read more in [[en/posts/2026-11-22-caching-under-load|Caching under heavy load]].
