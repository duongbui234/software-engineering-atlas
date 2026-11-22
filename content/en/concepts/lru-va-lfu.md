---
title: "LRU and LFU"
description: "LRU evicts the key unused for the longest time; LFU evicts the least frequently used key."
tags: ["caching", "redis", "algorithms"]
type: note
region: Cache Region
lang: en
---

**LRU** is ruined by a scan (scanned keys look "recent"); **LFU** keeps hot keys because it looks at frequency. Redis approximates both by sampling (`maxmemory-samples` 5); LFU uses an 8-bit logarithmic counter (a Morris counter) that decays over time (`lfu-log-factor`, `lfu-decay-time`).

Read more in [[en/posts/2026-11-22-caching-redis|Redis as a cache]].
