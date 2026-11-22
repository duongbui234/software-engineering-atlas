---
title: "Heartbeat"
description: "The Engine.IO server sends a ping every pingInterval, and the client must answer with a pong within pingTimeout or be considered dead."
tags: ["realtime", "socket-io"]
type: note
region: Realtime Region
lang: en
---

Engine.IO v4's **heartbeat**: the server sends packet `2` (ping) every `pingInterval` (default 25 seconds), and the client must answer with `3` (pong) within `pingTimeout` (default 20 seconds). This is an application-level heartbeat, not the RFC 6455 ping frame, so it works over long polling too. It also lets proxies see data flowing so they don't cut silent connections.

Read more in [[en/posts/2026-11-22-websocket-socketio|Socket.IO is not WebSocket]].
