---
title: "Caching"
description: "Keeping a small, fast copy of data to reuse, trading freshness for speed."
tags: [caching, api, performance]
type: note
region: Cache Region
lang: en
---

A **cache** is a small, fast copy of data that lives somewhere slower. It exists at many tiers: the browser and the CDN (controlled with `Cache-Control`, `ETag`), the application's RAM, shared Redis, and inside the database itself. A cache works thanks to locality: users read a small group of data over and over. The price is that data can be stale; the hard parts are invalidation, preventing stampedes when a hot key expires, and keeping the cache secure.

The whole [[en/series/caching|Caching line]] starts with [[en/posts/2026-11-22-caching-why|Why we need a cache]]. Caching first appears in [[en/posts/2026-11-18-api-performance|API performance]].
