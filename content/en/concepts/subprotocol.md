---
title: "Subprotocol"
description: "The client offers a list of higher-level protocols in Sec-WebSocket-Protocol, and the server picks one."
tags: ["realtime", "websocket"]
type: note
region: Realtime Region
lang: en
---

**Subprotocol**: WebSocket only carries bytes, so the two sides must agree on the content themselves. The client sends `Sec-WebSocket-Protocol: stock.v1, stock.v2`, and the server picks exactly one of them and sends it back; if it returns one that wasn't offered, the browser aborts the connection. Good for versioning the message format; examples include STOMP, MQTT and `graphql-transport-ws`.

Read more in [[en/posts/2026-11-22-websocket-protocol|Inside the WebSocket protocol]].
