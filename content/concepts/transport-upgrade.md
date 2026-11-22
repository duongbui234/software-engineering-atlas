---
title: "Transport Upgrade"
description: "Engine.IO bắt đầu bằng long polling, thử WebSocket bằng 2probe/3probe rồi chuyển hẳn sang."
tags: ["realtime", "socket-io"]
type: note
region: Vùng Realtime
---

**Transport upgrade**: sau khi phiên long polling đã chạy, client mở thêm một WebSocket cùng `sid`, gửi `2probe`, server đáp `3probe`; client dừng polling (server trả `6` noop cho request đang treo) rồi gửi `5` để chuyển hẳn. Có thể bỏ bước polling bằng `transports: ["websocket"]`, đổi lại là mất đường lui khi mạng chặn WebSocket.

Đọc thêm trong bài [[posts/2026-11-22-websocket-socketio|Socket.IO không phải WebSocket]].
