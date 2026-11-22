---
title: "Socket.IO Packet"
description: "A Socket.IO packet sits inside an Engine.IO message packet, for example 42[\"stock_update\",{…}]."
tags: ["realtime", "socket-io"]
type: note
region: Realtime Region
lang: en
---

A **Socket.IO packet** travels inside Engine.IO packet `4` (message). The second digit is the type: 0 CONNECT, 1 DISCONNECT, 2 EVENT, 3 ACK, 4 CONNECT_ERROR, 5–6 with binary data. Then come the namespace, an ack id if any, then a JSON array `[event name, data…]`. So `socket.emit('x', data)` on the wire is `42["x",{…}]`, not JSON you wrote yourself.

Read more in [[en/posts/2026-11-22-websocket-socketio|Socket.IO is not WebSocket]].
