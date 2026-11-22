---
title: "Cache Poisoning"
description: "Abusing an input that is not part of the cache key so the cache stores a malicious response and serves it to everyone."
tags: ["caching", "security", "http"]
type: note
region: Cache Region
lang: en
---

**Web cache poisoning** (James Kettle, 2018): the origin uses a header such as `X-Forwarded-Host` to build the page, the cache keys only on the URL, and the attacker triggers a malicious copy under the shared key. Block it: every input that affects the response must be in the key or be stripped before the origin.

Read more in [[en/posts/2026-11-22-caching-operations|Operations and security]].
