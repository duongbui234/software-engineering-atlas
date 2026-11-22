---
title: "Big Key"
description: "A key with a very large value or a collection with very many elements, making Redis slow to read, delete or expire it."
tags: ["caching", "redis"]
type: note
region: Cache Region
lang: en
---

A **big key** hurts because Redis runs commands on a single thread: in the example, `DEL` on a hash with 1 million fields blocks every client for about 51 ms. Use `UNLINK` (frees memory on a background thread), split the key, and enable `lazyfree-*` if needed; find big keys with `--bigkeys`, `--memkeys`, `MEMORY USAGE`.

Read more in [[en/posts/2026-11-22-caching-redis|Redis as a cache]].
