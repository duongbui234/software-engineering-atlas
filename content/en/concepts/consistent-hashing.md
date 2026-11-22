---
title: "Consistent Hashing"
description: "Splitting keys across nodes on a hash ring so that adding or removing a node moves only about 1/N of the keys."
tags: ["caching", "distributed-systems"]
type: note
region: Cache Region
lang: en
---

**Consistent hashing** (Karger et al., 1997) places nodes and keys on a ring, and a key belongs to the first node clockwise; virtual nodes spread keys more evenly. Adding a 5th node: `hash % N` moves 80% of keys to another node, consistent hashing about 20%.

Read more in [[en/posts/2026-11-22-caching-distributed|Many tiers, many machines]].
