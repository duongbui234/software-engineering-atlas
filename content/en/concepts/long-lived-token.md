---
title: "Long-lived Token"
description: "The token checked at the handshake expires after 15 minutes, but the connection can live for hours."
tags: ["realtime", "security", "auth"]
type: note
region: Realtime Region
lang: en
---

**A token outliving its expiry**: a WebSocket connection only checks the token at the handshake, so a 15-minute access token can still open a connection that lives three hours, even after the user has been banned. The fix: schedule a disconnect exactly at `exp`, re-check periodically or in a per-event middleware, and let the client send a new token (or reconnect) before the old one expires.

Read more in [[en/posts/2026-11-22-websocket-security|Security and operations]].
