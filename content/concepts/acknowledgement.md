---
title: "Acknowledgement"
description: "Emit kèm callback: bên nhận gọi callback, bên gửi nhận lại kết quả cho đúng lần emit đó."
tags: ["realtime", "socket-io"]
type: note
region: Vùng Realtime
---

**Acknowledgement** (ack): `socket.emit('subscribe_campaign', body, (resp) => …)` gắn một mã số vào gói EVENT; bên nhận trả gói ACK cùng mã đó. Kiểu hỏi-đáp trên kết nối realtime, có `timeout()` và `emitWithAck()`. Ack chỉ xác nhận bên kia đã chạy handler; nó không biến Socket.IO thành giao nhận đảm bảo.

Đọc thêm trong bài [[2026-11-22-websocket-socketio|Socket.IO không phải WebSocket]].
