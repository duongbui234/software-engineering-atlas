---
title: "Stale-While-Revalidate"
description: "After expiry, keep returning the stale copy immediately for N seconds while fetching a fresh one in the background."
tags: ["caching", "http"]
type: note
region: Cache Region
lang: en
---

**stale-while-revalidate** (RFC 5861) means nobody has to wait for the origin right after an entry expires; the price is possibly seeing stale data for up to N more seconds. It goes with `stale-if-error`, which uses the stale copy when the origin fails with 500, 502, 503, 504.

Read more in [[en/posts/2026-11-22-caching-http|Caching along the HTTP path]].
