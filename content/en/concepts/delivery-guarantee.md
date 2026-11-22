---
title: "Delivery Guarantee"
description: "Socket.IO delivers at most once by default: messages the server sends while a client is disconnected are lost."
tags: ["realtime", "socket-io", "reliability"]
type: note
region: Realtime Region
lang: en
---

Socket.IO's default **delivery guarantee** is **at most once**: ordering is preserved, but messages can be lost. A disconnected client buffers its own messages to send later; the server buffers nothing for absent clients. If you want at least once, you build it yourself: give every message an id, store it, and have the client report its last id on reconnection so the server can replay (see [[en/concepts/at-least-once-delivery]]).

Read more in [[en/posts/2026-11-22-websocket-rooms|Namespaces, rooms and reconnecting]].
