---
title: "Two-tier Cache"
description: "L1 in each pod's RAM, a shared L2 (Redis), and only then the source."
tags: ["caching", "architecture"]
type: note
region: Cache Region
lang: en
---

A **two-tier cache** reads top to bottom, and a miss at a tier refills that tier. The hard part is telling every pod to drop L1 when the data changes; L1 always needs a TTL as a safety net because invalidation messages can be missed.

Read more in [[en/posts/2026-11-22-caching-distributed|Many tiers, many machines]].
