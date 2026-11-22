---
title: "Negative Caching"
description: "Caching \"does not exist\" answers too, usually with a shorter TTL."
tags: ["caching", "patterns"]
type: note
region: Cache Region
lang: en
---

**Negative caching** keeps repeated questions about something that does not exist from hitting the database every time (DNS does this per RFC 2308). The "not found" entry must be deleted when the thing is created; it does not stop an attacker sweeping with a new id each time.

Read more in [[en/posts/2026-11-22-caching-invalidation|Invalidation]].
