---
title: "Ping/Pong"
description: "Control frames that ask \"are you still alive\": whoever receives a ping must answer with a pong carrying the same content."
tags: ["realtime", "websocket"]
type: note
region: Realtime Region
lang: en
---

**Ping/Pong** are two RFC 6455 control frames (opcodes 9 and 10): whoever receives a ping must answer with a pong carrying the same payload. They are used to detect connections that died silently and to keep proxies from cutting silent connections. The browser's WebSocket API doesn't let you send a ping yourself, only replies with pong automatically, so a client-side heartbeat has to be built at the application layer.

Read more in [[en/posts/2026-11-22-websocket-protocol|Inside the WebSocket protocol]].
