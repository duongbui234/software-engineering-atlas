---
title: "Reverse Proxy Upgrade"
description: "The proxy must forward the Upgrade/Connection headers over HTTP/1.1 for WebSocket to get through."
tags: ["realtime", "networking"]
type: note
region: Realtime Region
lang: en
---

**Upgrade through a reverse proxy**: `Upgrade` and `Connection` are hop-by-hop headers that proxies don't forward on their own. With nginx you need `proxy_http_version 1.1`, `proxy_set_header Upgrade $http_upgrade` and `proxy_set_header Connection "upgrade"`. ingress-nginx does this out of the box; forget it and the handshake returns 400 or Socket.IO silently stays on long polling.

Read more in [[en/posts/2026-11-22-websocket-scaling|Running on many pods]].
