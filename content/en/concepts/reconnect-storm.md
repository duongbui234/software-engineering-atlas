---
title: "Reconnect Storm"
description: "One pod shuts down and thousands of clients reconnect at the same time; jitter spreads them out over time."
tags: ["realtime", "reliability", "scaling"]
type: note
region: Realtime Region
lang: en
---

**Reconnect storm** (a thundering herd on reconnection): a pod dying or a deploy makes all its clients lose their connection at the same moment, and if they all wait exactly 1 second and reconnect, the remaining pods take a pile-up of handshakes, authentications and subscriptions. Socket.IO spreads them out with `randomizationFactor` (default 0.5): in the example, 10,000 clients land in 10 windows of 100 ms instead of 1.

Read more in [[en/posts/2026-11-22-websocket-scaling|Running on many pods]].
