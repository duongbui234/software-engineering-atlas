---
title: "Hit Ratio"
description: "The share of reads the cache answers; it decides speed and how much load is left for the source."
tags: ["caching", "performance", "observability"]
type: note
region: Cache Region
lang: en
---

**Hit ratio** = hits / total reads. It also measures the load the source has to carry: going from 95% to 99% cuts database load by 5 times. Hit ratio depends on the cache size relative to the working set and on how concentrated access is; measure it per kind of cache, not only with Redis's lumped number.

Read more in [[en/posts/2026-11-22-caching-why|Why we need a cache]].
