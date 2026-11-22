---
title: "Reverse Proxy Upgrade"
description: "Proxy phải chuyển tiếp header Upgrade/Connection bằng HTTP/1.1 thì WebSocket mới đi qua được."
tags: ["realtime", "networking"]
type: note
region: Vùng Realtime
---

**Upgrade qua reverse proxy**: `Upgrade` và `Connection` là header hop-by-hop, proxy không tự chuyển tiếp. Với nginx phải có `proxy_http_version 1.1`, `proxy_set_header Upgrade $http_upgrade` và `proxy_set_header Connection "upgrade"`. ingress-nginx làm sẵn việc này; quên thì handshake trả 400 hoặc Socket.IO lặng lẽ ở lại long polling.

Đọc thêm trong bài [[posts/2026-11-22-websocket-scaling|Chạy trên nhiều pod]].
