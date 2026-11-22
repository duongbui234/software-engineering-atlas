---
title: "Cache Invalidation"
description: "Making a stale cache entry stop being used when the source changes."
tags: ["caching", "consistency"]
type: note
region: Cache Region
lang: en
---

**Cache invalidation** comes in three forms: relying on TTL only, deleting in the write code after commit, or event-driven (CDC reading the commit log, like Facebook's mcsqueal or Debezium). The hardest part is deleting every affected key, including along dependency chains such as inherited permissions.

Read more in [[en/posts/2026-11-22-caching-invalidation|Invalidation]].
