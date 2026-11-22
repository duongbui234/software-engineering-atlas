---
title: WebSockets
description: "A long-lived bidirectional connection that lets the server push messages on its own."
tags: [api, realtime]
type: note
region: API Region
lang: en
---

**WebSocket** (RFC 6455) upgrades an HTTP request (`101 Switching Protocols`) into a bidirectional channel, so the server can send messages at any time instead of waiting for the client to ask. Flash-sale uses Socket.IO (a library with its own protocol that runs over long polling or WebSocket, so a plain WebSocket client cannot connect) to report queue position and order results, with the Redis adapter to run many pods.

Read more in [[en/posts/2026-11-18-api-styles|Five API Styles]].

Go down to the byte, from the handshake to running many pods, on [[en/series/websocket|the WebSocket and Socket.IO line]], starting with [[en/posts/2026-11-22-websocket-realtime-options|Four ways for a server to push news]].
