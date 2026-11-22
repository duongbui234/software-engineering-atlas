---
title: "Graceful Shutdown"
description: "When a pod is about to shut down: stop accepting new connections, close realtime connections deliberately and gradually, and only then exit."
tags: ["realtime", "reliability", "kubernetes"]
type: note
region: Realtime Region
lang: en
---

**Graceful shutdown** for realtime connections: on SIGTERM, the pod marks itself not ready so the load balancer stops sending new connections, then closes its live connections (ideally gradually) so clients reconnect to another pod on their own, before the process exits. Note that closing with `socket.disconnect()` means the Socket.IO client will **not** reconnect on its own; closing the transport (`io.close()`) means it will.

Read more in [[en/posts/2026-11-22-websocket-scaling|Running on many pods]].
