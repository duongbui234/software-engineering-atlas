---
title: "Handshake Authentication"
description: "Authenticate once when the connection opens: the token goes in Socket.IO's auth, not in the query string."
tags: ["realtime", "security", "auth"]
type: note
region: Realtime Region
lang: en
---

**Handshake authentication**: authenticate once when the connection opens, then attach the identity to the socket. With Socket.IO, send the token in `auth` (which travels in the CONNECT packet) rather than the query string, because URLs often get written to proxy logs. Browsers don't let you set arbitrary headers for WebSocket, so with plain WebSocket you usually use cookies (plus an Origin check) or a short-lived ticket fetched via REST.

Read more in [[en/posts/2026-11-22-websocket-security|Security and operations]].
