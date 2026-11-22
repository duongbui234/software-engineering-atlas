---
title: "Realtime Checklist"
description: "Danh sách kiểm tra trước khi đưa WebSocket/Socket.IO lên production, và cách chọn giữa SSE, WebSocket, Socket.IO."
tags: ["realtime", "production"]
type: note
region: Vùng Realtime
---

**Realtime checklist**: chọn công cụ (SSE nếu chỉ server → client, WebSocket thuần nếu cần nhẹ và client đa nền tảng, Socket.IO nếu cần room, ack, tự nối lại), rồi kiểm: xác thực lúc bắt tay và khi token hết hạn, kiểm Origin, giới hạn kích thước và tốc độ tin, heartbeat ngắn hơn idle timeout, sticky session hoặc chỉ WebSocket, adapter cho nhiều pod, jitter khi nối lại, và đường REST để đồng bộ lại tin bị lỡ.

Đọc thêm trong bài [[2026-11-22-websocket-security|An toàn và vận hành]].
