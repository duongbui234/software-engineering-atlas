---
title: "Engine.IO"
description: "Tầng dưới của Socket.IO: giữ một phiên qua long polling hoặc WebSocket, có heartbeat và mã phiên sid."
tags: ["realtime", "socket-io"]
type: note
region: Vùng Realtime
---

**Engine.IO** là tầng vận chuyển của Socket.IO. Nó mở phiên bằng một GET long polling, cấp mã phiên `sid`, rồi thử nâng cấp lên WebSocket. Gói tin của nó bắt đầu bằng một chữ số: 0 open, 1 close, 2 ping, 3 pong, 4 message, 5 upgrade, 6 noop. Vì có tầng này, Socket.IO có giao thức riêng và không nói chuyện được với WebSocket thuần.

Đọc thêm trong bài [[2026-11-22-websocket-socketio|Socket.IO không phải WebSocket]].
