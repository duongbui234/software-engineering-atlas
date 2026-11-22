---
title: "Idle Timeout"
description: "A proxy or load balancer cuts connections that stay silent longer than N seconds; the heartbeat must be faster than N."
tags: ["realtime", "networking"]
type: note
region: Realtime Region
lang: en
---

**Idle timeout**: every layer between client and server (nginx `proxy_read_timeout`, default 60 seconds, cloud load balancers, NAT) cuts connections that carry no data for some time. The heartbeat must be shorter than the smallest such timeout in the chain. The Socket.IO documentation recommends a proxy timeout larger than `pingInterval + pingTimeout` (45 seconds with the defaults).

Read more in [[en/posts/2026-11-22-websocket-scaling|Running on many pods]].
