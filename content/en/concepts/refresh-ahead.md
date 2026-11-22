---
title: "Refresh-Ahead"
description: "An entry read when it is about to expire is refreshed in the background, so readers never wait for the source."
tags: ["caching", "patterns"]
type: note
region: Cache Region
lang: en
---

**Refresh-ahead** keeps hot entries from ever really expiring, while rarely read entries are simply left to expire. The price is a few extra queries. It belongs to the same family as stale-while-revalidate (refresh after expiry) and XFetch (probabilistic early refresh).

Read more in [[en/posts/2026-11-22-caching-patterns|Read and write patterns]].
