---
title: "Auto Reconnect"
description: "Client Socket.IO tự kết nối lại với thời gian chờ tăng dần có ngẫu nhiên; giới hạn số lần thì có thể bỏ cuộc."
tags: ["realtime", "socket-io", "reliability"]
type: note
region: Vùng Realtime
---

**Auto reconnect**: khi kết nối đứt bất thường, client Socket.IO tự thử lại sau khoảng 1, 2, 4, 5, 5… giây (mặc định, có ngẫu nhiên ±50%), không giới hạn số lần. Đặt `reconnectionAttempts: 5` thì sau lần thứ năm client phát `reconnect_failed` và bỏ cuộc hẳn. Server chủ động `disconnect()` thì client không tự nối lại. WebSocket thuần không có cơ chế này.

Đọc thêm trong bài [[2026-11-22-websocket-rooms|Namespace, room và kết nối lại]].
