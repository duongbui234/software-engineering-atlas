---
title: "Cache Key"
description: "The key used to find an entry in the cache; it must contain everything that changes the result, and only that."
tags: ["caching", "design"]
type: note
region: Cache Region
lang: en
---

A **cache key** missing information returns the wrong thing (page 2 gets page 1, one person sees another's data); a key with extra information (a timestamp, a request id) never hits. Normalize it (sort parameters, hash) so that the same meaning gives the same key, and name keys by the convention `<type>:<id>`.

Read more in [[en/posts/2026-11-22-caching-why|Why we need a cache]].
