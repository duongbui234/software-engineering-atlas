---
title: "Stale Set Race"
description: "A reader misses the cache, reads old data from the DB, gets delayed, then writes the stale value into the cache after the writer has deleted it."
tags: ["caching", "consistency", "concurrency"]
type: note
region: Cache Region
lang: en
---

A **stale set** is a gap in cache-aside: the writer's delete happens before the reader's late cache write, so the cache stays wrong until the TTL runs out. It is more likely when reading from replicas. Cure it with a lease or a version; delayed double delete only narrows the window.

Read more in [[en/posts/2026-11-22-caching-invalidation|Invalidation]].
