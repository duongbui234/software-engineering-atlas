---
title: WebSockets
description: "Kết nối hai chiều lâu dài, cho phép server chủ động đẩy tin."
tags: [api, realtime]
type: note
region: Vùng API
---

**WebSocket** (RFC 6455) nâng cấp một request HTTP (`101 Switching Protocols`) thành kênh hai chiều, để server gửi tin bất cứ lúc nào thay vì chờ client hỏi. Flash-sale dùng Socket.IO (một thư viện có giao thức riêng, chạy trên long polling hoặc WebSocket, nên client WebSocket thuần không nối được) để báo vị trí hàng chờ và kết quả đơn, với Redis adapter để chạy nhiều pod.

Đọc thêm trong bài [[2026-11-18-api-styles|Năm kiểu API]].

Đi sâu từng byte, từ handshake tới chạy nhiều pod, trong [[websocket|tuyến WebSocket và Socket.IO]], bắt đầu từ [[2026-11-22-websocket-realtime-options|Bốn cách để server báo tin]].
