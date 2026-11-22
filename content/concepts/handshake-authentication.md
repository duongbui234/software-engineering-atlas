---
title: "Handshake Authentication"
description: "Xác thực một lần lúc mở kết nối: token trong auth của Socket.IO, không đặt trong query string."
tags: ["realtime", "security", "auth"]
type: note
region: Vùng Realtime
---

**Handshake authentication**: xác thực một lần khi kết nối mở, rồi gắn danh tính vào socket. Với Socket.IO, gửi token trong `auth` (đi trong gói CONNECT) thay vì query string, vì URL hay bị ghi vào log của proxy. Trình duyệt không cho đặt header tùy ý cho WebSocket, nên với WebSocket thuần thường dùng cookie (kèm kiểm Origin) hoặc một vé ngắn hạn lấy qua REST.

Đọc thêm trong bài [[2026-11-22-websocket-security|An toàn và vận hành]].
