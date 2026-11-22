---
title: "Staleness"
description: "How old the cached copy is compared with the original; the price of every cache."
tags: ["caching", "consistency"]
type: note
region: Cache Region
lang: en
---

**Staleness** is the gap between the cache and the source after the source changes. Every caching decision starts with the question "how stale is acceptable at most" for each kind of data. Data that must never be stale (stock at checkout) is not decided on from the cache.

Read more in [[en/posts/2026-11-22-caching-why|Why we need a cache]].
