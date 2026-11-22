---
title: "Room"
description: "A group of sockets only the server knows about, used to send one message to every socket in the group."
tags: ["realtime", "socket-io"]
type: note
region: Realtime Region
lang: en
---

A **room** is a group of sockets managed by the server: `socket.join('campaign:c-21h')`, then `to('campaign:c-21h').emit(…)` sends to everyone in the group. The client doesn't know which rooms it is in. Every socket is automatically in a room named after its id; a `user:<id>` room gathers all of one person's tabs. For rooms to work across many pods, you need an adapter.

Read more in [[en/posts/2026-11-22-websocket-rooms|Namespaces, rooms and reconnecting]].
