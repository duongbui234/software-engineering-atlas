---
title: "Versioned Key"
description: "Using version numbers so the cache rejects old values, or so a whole group of keys is invalidated by changing the version."
tags: ["caching", "consistency", "design"]
type: note
region: Cache Region
lang: en
---

**Version in the value**: the cache only accepts a value whose version is newer than the one it holds, and the writer leaves a tombstone instead of deleting outright. **Version in the key**: the key carries a generation number (`search:g17:...`), and bumping the generation invalidates the whole group without finding any keys. A hash in a static file name is another form of it.

Read more in [[en/posts/2026-11-22-caching-invalidation|Invalidation]].
