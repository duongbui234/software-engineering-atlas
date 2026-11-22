---
title: "Hot Key"
description: "A key that gets so many reads that the cache node holding it is overloaded."
tags: ["caching", "redis", "performance"]
type: note
region: Cache Region
lang: en
---

A **hot key** differs from a stampede: the cache still hits, but one node carries all of it. Adding nodes cannot split a single key. Patch it with an in-RAM cache in each pod for hot keys, key replication (`product:42#0..7`), or reading from replicas. Find them with `redis-cli --hotkeys` (needs an LFU policy).

Read more in [[en/posts/2026-11-22-caching-under-load|Caching under heavy load]].
