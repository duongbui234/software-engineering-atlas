---
title: "Server-Sent Events"
description: "An HTTP response that never ends, into which the server writes text events one by one, one-way only."
tags: ["realtime", "http"]
type: note
region: Realtime Region
lang: en
---

**Server-Sent Events** (SSE, `EventSource` in the browser): the response has `Content-Type: text/event-stream`, and the server writes `data: …` lines whenever there is news. The browser reconnects automatically and sends `Last-Event-ID` so the server can replay. Server → client only, text only; over HTTP/1.1 it is limited to 6 connections per domain, over HTTP/2 it isn't.

Read more in [[en/posts/2026-11-22-websocket-realtime-options|Four ways for the server to send news]].
