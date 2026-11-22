---
title: "CDN"
description: "A network of servers placed close to users, holding shared copies of content and shielding the origin from load."
tags: ["caching", "http", "infrastructure"]
type: note
region: Cache Region
lang: en
---

A **CDN** (Content Delivery Network) is a shared cache: one copy serves many people, so it must not keep private data (`private`, `no-store`). Besides cutting latency, a CDN shields load: the origin only sees misses. Control it separately with `s-maxage` or `CDN-Cache-Control` (RFC 9213).

Read more in [[en/posts/2026-11-22-caching-http|Caching along the HTTP path]].
