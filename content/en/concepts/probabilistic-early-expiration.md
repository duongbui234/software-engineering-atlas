---
title: "Probabilistic Early Expiration"
description: "Each request flips its own coin to refresh early, with a probability that rises as expiry approaches (XFetch)."
tags: ["caching", "reliability", "performance"]
type: note
region: Cache Region
lang: en
---

**XFetch** (Vattani et al., VLDB 2015) recomputes when `now − delta × beta × ln(rand()) ≥ expiry`, where `delta` is the recomputation time and `beta = 1` by default. No lock or coordination between machines needed. In the example it cuts queries from 127 to 50; adding a background singleflight brings it to 6.

Read more in [[en/posts/2026-11-22-caching-under-load|Caching under heavy load]].
