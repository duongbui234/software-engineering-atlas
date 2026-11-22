---
title: "Cache-Control"
description: "The HTTP header that sets the caching rules for every cache along the way: lifetime, who may store it, whether it must be revalidated."
tags: ["caching", "http"]
type: note
region: Cache Region
lang: en
---

**Cache-Control** has these main directives: `max-age`, `s-maxage`, `public`, `private`, `no-cache` (may be stored but must be revalidated), `no-store` (must not be stored), `must-revalidate`, `immutable`, `stale-while-revalidate`, `stale-if-error`. With no rules, caches may guess a lifetime heuristically from `Last-Modified`.

Read more in [[en/posts/2026-11-22-caching-http|Caching along the HTTP path]].
