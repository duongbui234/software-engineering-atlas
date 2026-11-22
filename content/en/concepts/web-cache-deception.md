---
title: "Web Cache Deception"
description: "Tricking a victim into making a shared cache store their private page, which the attacker then reads from the cache."
tags: ["caching", "security", "http"]
type: note
region: Cache Region
lang: en
---

**Web cache deception** (Omer Gil, 2017): the cache treats `/account/avatar.css` as a static file by its extension, while the origin returns the account page. Block it: respect the origin's `Cache-Control`, return 404 for paths that do not exist, cache static files by directory rather than by extension.

Read more in [[en/posts/2026-11-22-caching-operations|Operations and security]].
