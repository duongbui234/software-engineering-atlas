---
title: "In-process Cache"
description: "A cache living in the application process's own RAM, with no network involved."
tags: ["caching", "performance"]
type: note
region: Cache Region
lang: en
---

An **in-process cache** is hundreds of times faster than Redis, but each pod keeps its own copy, there is no sync between pods, and it is empty when a pod starts. An unbounded `Map` is a memory leak; use an LRU with `max` and a TTL. It fits small data that is read extremely often and rarely changes.

Read more in [[en/posts/2026-11-22-caching-distributed|Many tiers, many machines]].
