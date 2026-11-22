---
title: "Transport Upgrade"
description: "Engine.IO starts with long polling, tests WebSocket with 2probe/3probe, then switches over for good."
tags: ["realtime", "socket-io"]
type: note
region: Realtime Region
lang: en
---

**Transport upgrade**: once the long-polling session is running, the client opens an additional WebSocket with the same `sid` and sends `2probe`, and the server answers `3probe`; the client stops polling (the server answers the hanging request with `6` noop) and then sends `5` to switch over for good. You can skip the polling step with `transports: ["websocket"]`, at the cost of losing the fallback when the network blocks WebSocket.

Read more in [[en/posts/2026-11-22-websocket-socketio|Socket.IO is not WebSocket]].
