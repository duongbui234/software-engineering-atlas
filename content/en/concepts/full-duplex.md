---
title: "Full-duplex"
description: "Both sides send data at the same time over the same connection, without waiting for their turn."
tags: ["realtime", "networking"]
type: note
region: Realtime Region
lang: en
---

**Full-duplex**: like a phone call, both sides can talk at the same time. With HTTP/1.1, one side asks and the other answers, taking turns. WebSocket opens a full-duplex connection: the client sends commands and the server pushes messages over the same line, independently of each other.

Read more in [[en/posts/2026-11-22-websocket-realtime-options|Four ways for the server to send news]].
