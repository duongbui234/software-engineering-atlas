---
title: "Maxmemory"
description: "The memory ceiling for Redis data; the default 0 means no limit."
tags: ["caching", "redis"]
type: note
region: Cache Region
lang: en
---

**maxmemory** triggers evictions under `maxmemory-policy` when a write pushes memory over the ceiling. Leave room for client buffers, replicas and the fork when writing a snapshot; in a container it must be below the container's limit. If unset, Redis grows until the operating system kills it.

Read more in [[en/posts/2026-11-22-caching-redis|Redis as a cache]].
