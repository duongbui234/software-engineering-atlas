---
title: "Locality"
description: "Access is not spread evenly: what was just used will soon be used again, and so will what sits next to it."
tags: ["caching", "performance"]
type: note
region: Cache Region
lang: en
---

**Locality** comes in two forms: temporal (what was just read will be read again soon) and spatial (reading one place means reading the place next to it soon). Thanks to it, a cache holding 1% of the catalog still hits 39% of views in the example; with uniform access, a 10% cache hits only 10%.

Read more in [[en/posts/2026-11-22-caching-why|Why we need a cache]].
