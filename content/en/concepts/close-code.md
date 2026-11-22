---
title: "Close Code"
description: "A 2-byte code in the close frame that says why the connection closed: 1000 normal, 1008 policy violation…"
tags: ["realtime", "websocket"]
type: note
region: Realtime Region
lang: en
---

**Close code**: a close frame carries a 2-byte code and a text reason. 1000 is a normal closure, 1001 means the other side is going away (server shutting down, tab closed), 1008 policy violation, 1009 message too big, 1011 server error. Code 1006 is never sent on the wire: the client assigns it when the connection is lost without a close frame, and it is the signal that you should reconnect.

Read more in [[en/posts/2026-11-22-websocket-protocol|Inside the WebSocket protocol]].
