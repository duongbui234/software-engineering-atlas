---
title: "Opening Handshake"
description: "Request HTTP GET có Upgrade: websocket, server đáp 101 để chuyển kết nối sang WebSocket."
tags: ["realtime", "websocket", "http"]
type: note
region: Vùng Realtime
---

**Opening handshake** của WebSocket là một request HTTP/1.1 bình thường kèm `Upgrade: websocket`, `Connection: Upgrade`, `Sec-WebSocket-Version: 13` và một `Sec-WebSocket-Key` ngẫu nhiên. Server đồng ý bằng `101 Switching Protocols` và `Sec-WebSocket-Accept = base64(SHA-1(key + GUID cố định))`. Từ sau dòng trống đó, cùng một kết nối TCP không còn nói HTTP nữa.

Đọc thêm trong bài [[2026-11-22-websocket-protocol|Bên trong giao thức WebSocket]].
