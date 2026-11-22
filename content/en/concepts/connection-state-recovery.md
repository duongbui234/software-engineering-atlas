---
title: "Connection State Recovery"
description: "Socket.IO 4.6+ keeps the id, rooms and missed messages of a briefly disconnected client and hands them back on reconnection."
tags: ["realtime", "socket-io", "reliability"]
type: note
region: Realtime Region
lang: en
---

**Connection state recovery**: enable `connectionStateRecovery` and the server keeps the state of a socket that just dropped for `maxDisconnectionDuration` (for example 2 minutes); when the client reconnects, it keeps its id, rooms and `socket.data` and receives the messages it missed, with `socket.recovered === true`. It doesn't always succeed, and it doesn't work with the Pub/Sub-based Redis adapter (you need the Redis Streams adapter or the MongoDB adapter).

Read more in [[en/posts/2026-11-22-websocket-rooms|Namespaces, rooms and reconnecting]].
