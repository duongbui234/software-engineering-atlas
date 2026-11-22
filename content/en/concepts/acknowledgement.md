---
title: "Acknowledgement"
description: "An emit with a callback: the receiver calls the callback, and the sender gets the result back for exactly that emit."
tags: ["realtime", "socket-io"]
type: note
region: Realtime Region
lang: en
---

**Acknowledgement** (ack): `socket.emit('subscribe_campaign', body, (resp) => …)` attaches an id number to the EVENT packet; the receiver returns an ACK packet with the same id. It is request-response over a realtime connection, with `timeout()` and `emitWithAck()`. An ack only confirms the other side ran the handler; it doesn't turn Socket.IO into guaranteed delivery.

Read more in [[en/posts/2026-11-22-websocket-socketio|Socket.IO is not WebSocket]].
