---
title: "Cache Penetration"
description: "Requests ask for keys that do not exist, so the cache never hits and every request goes to the database."
tags: ["caching", "reliability", "security"]
type: note
region: Cache Region
lang: en
---

**Cache penetration** can come from broken links or from bots sweeping ids to hit the database directly. Patch it with a negative cache (blocks repeated questions) and a Bloom filter (blocks even ids never asked before), plus rate limiting.

Read more in [[en/posts/2026-11-22-caching-under-load|Caching under heavy load]].
