---
title: "Cross-Site WebSocket Hijacking"
description: "A foreign page opens a WebSocket to your server and the browser sends the cookies automatically; WebSocket isn't blocked by CORS."
tags: ["realtime", "security"]
type: note
region: Realtime Region
lang: en
---

**Cross-Site WebSocket Hijacking** (CSWSH): WebSocket isn't subject to the Same-Origin Policy or CORS, so the page `evil.example` can open a connection to your server and the browser automatically attaches the cookies (if SameSite allows it). If the server authenticates with cookies without checking `Origin`, the attacker can read and send messages on the user's behalf. Block it by checking `Origin` at the handshake or by authenticating with an explicitly sent token.

Read more in [[en/posts/2026-11-22-websocket-security|Security and operations]].
