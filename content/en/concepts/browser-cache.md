---
title: "Browser Cache"
description: "The browser's own cache, serving only one person, controlled by HTTP headers."
tags: ["caching", "http"]
type: note
region: Cache Region
lang: en
---

The **browser cache** is a private cache in RFC 9111 terms: it may keep private data too, because nobody else can read it. The server controls it with `Cache-Control` and revalidates with `ETag`. It cannot be purged remotely, so static files should carry a hash in their names.

Read more in [[en/posts/2026-11-22-caching-http|Caching along the HTTP path]].
