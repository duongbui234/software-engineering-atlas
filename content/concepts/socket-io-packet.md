---
title: "Socket.IO Packet"
description: "Gói tin Socket.IO nằm trong gói message của Engine.IO, ví dụ 42[\"stock_update\",{…}]."
tags: ["realtime", "socket-io"]
type: note
region: Vùng Realtime
---

**Gói tin Socket.IO** đi bên trong gói `4` (message) của Engine.IO. Chữ số thứ hai là loại: 0 CONNECT, 1 DISCONNECT, 2 EVENT, 3 ACK, 4 CONNECT_ERROR, 5–6 có dữ liệu nhị phân. Sau đó là namespace, mã ack nếu có, rồi mảng JSON `[tên sự kiện, dữ liệu…]`. Vì vậy `socket.emit('x', data)` trên dây là `42["x",{…}]`, không phải JSON bạn tự viết.

Đọc thêm trong bài [[2026-11-22-websocket-socketio|Socket.IO không phải WebSocket]].
