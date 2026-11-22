---
title: "Engine.IO"
description: "The lower layer of Socket.IO: keeps a session over long polling or WebSocket, with a heartbeat and a session id (sid)."
tags: ["realtime", "socket-io"]
type: note
region: Realtime Region
lang: en
---

**Engine.IO** is Socket.IO's transport layer. It opens a session with a long-polling GET, issues a session id `sid`, then tries to upgrade to WebSocket. Its packets start with a single digit: 0 open, 1 close, 2 ping, 3 pong, 4 message, 5 upgrade, 6 noop. Because of this layer, Socket.IO has its own protocol and can't talk to plain WebSocket.

Read more in [[en/posts/2026-11-22-websocket-socketio|Socket.IO is not WebSocket]].
