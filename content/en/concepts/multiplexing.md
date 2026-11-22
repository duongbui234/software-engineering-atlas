---
title: "Multiplexing"
description: "Several namespaces share one Engine.IO connection, and the options of the first io() call win."
tags: ["realtime", "socket-io"]
type: note
region: Realtime Region
lang: en
---

**Multiplexing**: `io('/flash-sale')` and `io('/notifications')` to the same origin share one Manager, that is, one Engine.IO connection. It saves connections, but there is a trap: transport-level options such as `transports` on the later call are ignored, because the Manager was already created with the first call's options. To split them, use `forceNew: true`.

Read more in [[en/posts/2026-11-22-websocket-rooms|Namespaces, rooms and reconnecting]].
