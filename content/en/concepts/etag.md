---
title: "ETag"
description: "A version tag for a response, used to ask \"is my copy still valid?\" and get a 304 if it has not changed."
tags: ["caching", "http"]
type: note
region: Cache Region
lang: en
---

An **ETag** is set by the server; the client revalidates with `If-None-Match` and, if nothing changed, gets `304 Not Modified` with no body. A strong ETag (the default) means byte-for-byte identical, a weak one (`W/"..."`) means semantically equivalent. Deriving the ETag from a database version column is cheaper than hashing the whole body.

Read more in [[en/posts/2026-11-22-caching-http|Caching along the HTTP path]].
