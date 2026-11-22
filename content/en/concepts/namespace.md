---
title: "Namespace"
description: "A logical Socket.IO channel (/flash-sale, /notifications), each with its own handlers, middleware and rooms."
tags: ["realtime", "socket-io"]
type: note
region: Realtime Region
lang: en
---

A **namespace** splits one Socket.IO server into logical channels by path: `/flash-sale` for the queue and stock, `/notifications` for notifications. Each namespace has its own authentication middleware, handlers and rooms, but several namespaces can share one physical connection (multiplexing). This is a Socket.IO concept; plain WebSocket doesn't have it.

Read more in [[en/posts/2026-11-22-websocket-rooms|Namespaces, rooms and reconnecting]].
