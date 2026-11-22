---
title: Virtual Queue
description: "Line buyers up by arrival time and let them in batch by batch, so the write path isn't hit all at once."
tags: [flash-sale, scalability]
type: note
region: Flash Sale Region
lang: en
---

A **virtual queue** (waiting room) records each person's arrival time and lets them in by turns, a fixed number per turn or as many as the system can handle. It both protects the write path (checkout, stock reservation) and keeps things fair: first come, first in. Shopify records the arrival time in a signed cookie and lets each load balancer compute the threshold itself; my flash-sale records it in a ZSET in Redis. A good queue also has to know the stock: when it sells out, tell the people waiting right away.

Read more in [[en/posts/2026-11-21-shopify-flash-sale|How Shopify handles flash sales]].
