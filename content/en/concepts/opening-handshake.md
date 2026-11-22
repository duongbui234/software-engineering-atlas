---
title: "Opening Handshake"
description: "An HTTP GET request with Upgrade: websocket, answered by the server with 101 to switch the connection to WebSocket."
tags: ["realtime", "websocket", "http"]
type: note
region: Realtime Region
lang: en
---

The WebSocket **opening handshake** is an ordinary HTTP/1.1 request with `Upgrade: websocket`, `Connection: Upgrade`, `Sec-WebSocket-Version: 13` and a random `Sec-WebSocket-Key`. The server agrees with `101 Switching Protocols` and `Sec-WebSocket-Accept = base64(SHA-1(key + fixed GUID))`. After that blank line, the same TCP connection no longer speaks HTTP.

Read more in [[en/posts/2026-11-22-websocket-protocol|Inside the WebSocket protocol]].
