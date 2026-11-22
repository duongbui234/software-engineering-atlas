---
title: "Vary"
description: "A header telling the cache to add request headers to the cache key."
tags: ["caching", "http"]
type: note
region: Cache Region
lang: en
---

**Vary** is used when the same URL has several versions (for example `Vary: Accept-Language`). Choosing a header with many values (`User-Agent`, `Cookie`) shatters the cache into thousands of pieces; leaving out Vary when content depends on a header makes the cache serve the wrong version to someone else.

Read more in [[en/posts/2026-11-22-caching-http|Caching along the HTTP path]].
