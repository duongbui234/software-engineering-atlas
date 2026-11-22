---
title: "Request Coalescing"
description: "When many requests miss the same key, only one fetches and the others share its result."
tags: ["caching", "reliability", "concurrency"]
type: note
region: Cache Region
lang: en
---

**Request coalescing** within one process is singleflight (a table of key → in-flight promise); across machines it is a Redis lock `SET NX EX` with a token, released by a Lua script that compares the token, and losers wait a bounded time and then reread the cache. nginx has `proxy_cache_lock`.

Read more in [[en/posts/2026-11-22-caching-under-load|Caching under heavy load]].
