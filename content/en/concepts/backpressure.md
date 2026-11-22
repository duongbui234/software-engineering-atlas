---
title: "Backpressure"
description: "When the receiver reads slowly, the sender must slow down or drop some messages, or the buffer bloats in RAM."
tags: ["realtime", "performance", "reliability"]
type: note
region: Realtime Region
lang: en
---

**Backpressure**: WebSocket's `send()` doesn't block; when a client reads slowly (a 3G network, a sleeping tab), data piles up in the server's buffer, measurable through `bufferedAmount`. A server broadcasting stock every 100 ms to a few thousand slow clients can use up all its RAM. Ways to handle it: check `bufferedAmount` and drop stale messages (stock messages only need the latest version), coalesce messages, or disconnect clients that are too slow.

Read more in [[en/posts/2026-11-22-websocket-security|Security and operations]].
