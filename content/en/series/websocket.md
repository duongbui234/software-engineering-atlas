---
title: The WebSocket and Socket.IO Line
description: "Untangles the most common confusion about realtime on the web, that Socket.IO is WebSocket, in 6 stations: from \"why HTTP is not enough\" to the protocol on the wire, rooms and reconnecting, running many pods, and staying safe when connections live for hours."
series: websocket
code: WS
region: Realtime Region
draft: false
lang: en
stations:
  - name: Four ways for the server to send news
    concepts: [Server Push, Polling, Long Polling, Server-Sent Events, Full-duplex]
  - name: Inside the WebSocket protocol
    concepts: [Opening Handshake, WebSocket Frame, Masking, Ping/Pong, Close Code, Subprotocol]
  - name: Socket.IO is not WebSocket
    concepts: [Engine.IO, Transport Upgrade, Heartbeat, Socket.IO Packet, Acknowledgement]
  - name: Namespaces, rooms and reconnecting
    concepts: [Namespace, Room, Multiplexing, Auto Reconnect, Delivery Guarantee, Connection State Recovery]
  - name: Running on many pods
    concepts: [Sticky Session, Socket.IO Adapter, Reverse Proxy Upgrade, Idle Timeout, Reconnect Storm, Graceful Shutdown]
  - name: Security and operations
    concepts: [Cross-Site WebSocket Hijacking, Handshake Authentication, Long-lived Token, Backpressure, Message Size Limit, Realtime Checklist]
---

## If you are just starting

You don't need to know what WebSocket or Socket.IO is to ride this line. Station 1 starts from the simplest question: HTTP only lets the server answer when it is asked, so how can the server *tell* the browser ahead of time that "it's your turn now"?

The whole line shares one picture: **calling a shop on the phone**. HTTP is mailing a letter with a question and waiting for the reply. **WebSocket is a phone line**: you pick up once and both sides can talk whenever they like, but the line only carries sound; it knows nothing about "groups", "confirming you heard" or "calling back when the call drops". **Socket.IO is a switchboard** sitting on that line: it has group meeting rooms, signed receipts, automatic call-backs, and when there is no phone line it switches to sending letter after letter. The switchboard speaks its **own code**, so an ordinary phone calling into the switchboard hears sound but understands nothing, and the other way around.

That last sentence is where people get confused most: **a plain WebSocket client cannot talk to a Socket.IO server**, and a Socket.IO client cannot connect to a plain WebSocket server. Station 3 lets you see why with your own eyes.

Every station opens with **"Picture it first"** (the concepts compared with everyday life, plus a diagram) and a **quick glossary** for new terms. Read those two parts first, then move on to the technical part.

## Why this order

- **Stations 1–2** are the web standard: the ways a server can send news (polling, long polling, SSE, WebSocket) and the WebSocket protocol per RFC 6455, down to every byte on the wire. No library yet.
- **Stations 3–4** are Socket.IO: what it adds on top of WebSocket (Engine.IO, its own packets, acks), then the things people often assume belong to WebSocket (rooms, namespaces, automatic reconnection) and their real limits (messages can be lost).
- **Stations 5–6** are operations: running many pods behind a load balancer (sticky sessions, the Redis adapter, proxies, deploys), then the security and load capacity of connections that live for hours.

You can't understand why Socket.IO needs sticky sessions without knowing that Engine.IO starts with long polling; you can't understand why messages get lost during a deploy without knowing at most once. Each station uses only the vocabulary of the stations before it.

This line digs into a short section of the [[en/posts/2026-11-18-api-styles|Five API styles]] station of the API line, and reuses a few words from [[en/posts/2026-11-22-caching-distributed|the Caching line]] (Redis Pub/Sub) and [[en/series/rabbitmq|the RabbitMQ line]] (at most once, at least once).

## Versions and sources

The examples run for real on **Node.js 24** (built-in `WebSocket` client), **ws 8.23**, **Socket.IO 4.8.4** and **Redis 8**, with commands so you can rerun them. Every default value mentioned in the posts (pingInterval 25 seconds, pingTimeout 20 seconds, `maxHttpBufferSize` 1 MB, reconnection delays) was checked against the source code of exactly those versions.

Main sources: **RFC 6455** (WebSocket), RFC 8441 (WebSocket over HTTP/2), the WHATWG standards for Server-Sent Events and the WebSocket API; the official Socket.IO documentation (the Engine.IO v4 and Socket.IO v5 protocols, delivery guarantees, connection state recovery, multiple nodes); Christian Schneider's research (2013) on Cross-Site WebSocket Hijacking. The context examples come from **flash-sale**, a time-limited discount shop I wrote myself, trimmed and renamed.
