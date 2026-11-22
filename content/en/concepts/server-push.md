---
title: "Server Push"
description: "The server sends data to the client on its own initiative, without waiting for the client to ask."
tags: ["realtime", "http"]
type: note
region: Realtime Region
lang: en
---

**Server push** is when the server sends a message to the client on its own when something happens (stock changes, a payment turn comes up), instead of waiting for the client to ask. Plain HTTP can't do this: every response must go with a request. Every realtime technique on the web (long polling, SSE, WebSocket) is a different way to emulate or open up that road in the other direction.

Read more in [[en/posts/2026-11-22-websocket-realtime-options|Four ways for the server to send news]].
