---
title: "Socket.IO Adapter"
description: "The layer that carries room broadcasts between Socket.IO servers, for example the Redis adapter using Pub/Sub."
tags: ["realtime", "socket-io", "scaling", "redis"]
type: note
region: Realtime Region
lang: en
---

The **adapter** is the part of Socket.IO that decides which sockets a `to(room).emit()` reaches. The default adapter only knows the sockets in the current pod's RAM. The Redis adapter publishes every broadcast to Redis Pub/Sub so every pod sends it to its own sockets; each pod needs two separate Redis connections (pub and sub). Sticky sessions handle the way in, the adapter handles broadcasting out.

Read more in [[en/posts/2026-11-22-websocket-scaling|Running on many pods]].
