---
title: "TTL Jitter"
description: "Adding or subtracting a random amount to the TTL so many keys loaded together do not expire together."
tags: ["caching", "reliability"]
type: note
region: Cache Region
lang: en
---

**TTL jitter** (for example 60 seconds ± 20%) spreads expiries out, avoiding an "avalanche" after a bulk load, a restart or cache warming. The total number of queries stays the same, only the peak drops: from 2,000 to 526 queries per 100 ms in the example.

Read more in [[en/posts/2026-11-22-caching-under-load|Caching under heavy load]].
