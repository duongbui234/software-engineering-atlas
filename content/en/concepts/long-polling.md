---
title: "Long Polling"
description: "The server holds the request until there is news or a timeout, then the client asks again right away."
tags: ["realtime", "http"]
type: note
region: Realtime Region
lang: en
---

**Long polling**: the server doesn't answer right away but keeps the request hanging until an event happens (or the wait times out); once the client gets the response, it sends a new request. Latency is nearly instant and it runs on plain HTTP, so it is Socket.IO's fallback when WebSocket is blocked. The cost: every message takes a request, and with many servers you have to know which request belongs to which session.

Read more in [[en/posts/2026-11-22-websocket-realtime-options|Four ways for the server to send news]].
