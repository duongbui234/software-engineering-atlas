---
title: "Auto Reconnect"
description: "The Socket.IO client reconnects on its own with increasing, randomized delays; cap the number of attempts and it may give up."
tags: ["realtime", "socket-io", "reliability"]
type: note
region: Realtime Region
lang: en
---

**Auto reconnect**: when the connection drops abnormally, the Socket.IO client retries on its own after about 1, 2, 4, 5, 5… seconds (default, with ±50% randomness), with no limit on attempts. Set `reconnectionAttempts: 5` and after the fifth attempt the client emits `reconnect_failed` and gives up for good. If the server deliberately calls `disconnect()`, the client doesn't reconnect on its own. Plain WebSocket has no such mechanism.

Read more in [[en/posts/2026-11-22-websocket-rooms|Namespaces, rooms and reconnecting]].
