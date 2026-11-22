---
title: "Cache Warming"
description: "Preloading data that is certain to be read before taking traffic."
tags: ["caching", "reliability"]
type: note
region: Cache Region
lang: en
---

**Cache warming** keeps the first wave of users after a startup or deploy from falling straight through to the database: load feature flags, permissions and the products about to go on sale before peak hour. Rate-limit the loading and add TTL jitter so it does not cause its own load spike or a mass expiry.

Read more in [[en/posts/2026-11-22-caching-distributed|Many tiers, many machines]].
