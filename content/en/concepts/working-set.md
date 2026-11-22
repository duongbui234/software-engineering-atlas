---
title: "Working Set"
description: "The group of data being read over a period of time; the cache only needs to hold this group."
tags: ["caching", "performance"]
type: note
region: Cache Region
lang: en
---

The **working set** (Denning, 1968) is the set of data a system is actually using within a time window. During a flash sale, that is a few dozen discounted products, not the whole catalog. A cache smaller than the working set misses constantly; one much larger wastes RAM.

Read more in [[en/posts/2026-11-22-caching-why|Why we need a cache]].
