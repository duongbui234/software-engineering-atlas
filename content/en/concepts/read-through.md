---
title: "Read-Through"
description: "The application asks only the cache; the cache is configured with a loader function and fetches from the source itself on a miss."
tags: ["caching", "patterns"]
type: note
region: Cache Region
lang: en
---

**Read-through** looks the same as cache-aside from the database's point of view; the only difference is who owns the loading code. Read code is compact and uniform, and the cache can coalesce misses on the same key itself. It does not solve invalidation on its own.

Read more in [[en/posts/2026-11-22-caching-patterns|Read and write patterns]].
