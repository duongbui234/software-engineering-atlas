---
title: "Lock Ordering"
description: "Every piece of code that locks several rows does so in the same global order, so no wait cycle can form."
tags: ["database", "locking"]
type: note
region: Database Region
lang: en
---

**Lock ordering**: if everyone locks A before B, whoever comes second waits right at the first lock while holding nothing, so there is no wait cycle. flash-sale sorts `skuId` in ascending order before reserving stock for the whole cart, and again when releasing it. The order must be consistent across every path that touches the same rows (checkout, releasing stock, admin jobs), and you should take the strongest lock you will need right from the start.

Read more in [[en/posts/2026-11-22-transactions-deadlock|Deadlocks and long transactions]].
