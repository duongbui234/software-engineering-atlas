---
title: "Sticky Session"
description: "The load balancer always sends a client back to the same server, mandatory when Socket.IO uses long polling."
tags: ["realtime", "socket-io", "scaling"]
type: note
region: Realtime Region
lang: en
---

**Sticky session**: the load balancer binds a client to one backend (by cookie or by IP). Socket.IO needs it when long polling is in play, because every poll is a separate HTTP request and only the pod that issued the `sid` knows that session; reach the wrong pod and you get `400 Session ID unknown`. With WebSocket only (`transports: ["websocket"]`) you don't need it, because the whole session is one TCP connection.

Read more in [[en/posts/2026-11-22-websocket-scaling|Running on many pods]].
