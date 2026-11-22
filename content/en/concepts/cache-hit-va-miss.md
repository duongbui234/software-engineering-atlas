---
title: "Cache Hit and Miss"
description: "Hit: the data is already in the cache. Miss: it has to be fetched from the source."
tags: ["caching", "performance"]
type: note
region: Cache Region
lang: en
---

A **hit** is a read that finds the data in the cache and returns it right away. A **miss** is one that does not: it has to read the source (database, origin), plus the time already spent asking the cache, and then usually writes the result into the cache. Because a miss costs a little more than having no cache at all, a cache that misses almost always is a net loss.

Read more in [[en/posts/2026-11-22-caching-why|Why we need a cache]].
