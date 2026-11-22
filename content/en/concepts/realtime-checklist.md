---
title: "Realtime Checklist"
description: "A checklist before putting WebSocket/Socket.IO into production, and how to choose between SSE, WebSocket and Socket.IO."
tags: ["realtime", "production"]
type: note
region: Realtime Region
lang: en
---

**Realtime checklist**: pick the tool (SSE if it's server → client only, plain WebSocket if you need something light with multi-platform clients, Socket.IO if you need rooms, acks and automatic reconnection), then check: authentication at the handshake and when the token expires, an Origin check, message size and rate limits, a heartbeat shorter than the idle timeout, sticky sessions or WebSocket only, an adapter for multiple pods, jitter on reconnection, and a REST path to resynchronize missed messages.

Read more in [[en/posts/2026-11-22-websocket-security|Security and operations]].
