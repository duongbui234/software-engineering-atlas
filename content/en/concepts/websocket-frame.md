---
title: "WebSocket Frame"
description: "The unit of data in WebSocket: a few header bytes (FIN, opcode, MASK, length), then the payload."
tags: ["realtime", "websocket"]
type: note
region: Realtime Region
lang: en
---

A **frame** is how WebSocket packages data: byte 1 holds the FIN bit (the final fragment of a message) and the opcode (1 text, 2 binary, 8 close, 9 ping, 10 pong), byte 2 holds the MASK bit and the length (under 126 it is written directly, 126 adds 2 bytes, 127 adds 8 bytes). A large message can be split into several frames. The overhead is only 2–14 bytes per frame, compared with the few hundred header bytes of an HTTP request.

Read more in [[en/posts/2026-11-22-websocket-protocol|Inside the WebSocket protocol]].
