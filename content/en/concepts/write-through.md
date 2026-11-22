---
title: "Write-Through"
description: "On every write, write both the database and the cache before replying."
tags: ["caching", "patterns"]
type: note
region: Cache Region
lang: en
---

**Write-through** makes a read right after a write always hit, at the cost of slower writes and a cache that may fill with things nobody reads (it needs a TTL). Because it writes the new value, two concurrent writes can still leave a wrong value behind.

Read more in [[en/posts/2026-11-22-caching-patterns|Read and write patterns]].
