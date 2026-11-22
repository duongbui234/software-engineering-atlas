---
title: "Namespace"
description: "Kênh logic của Socket.IO (/flash-sale, /notifications), mỗi kênh có handler, middleware và room riêng."
tags: ["realtime", "socket-io"]
type: note
region: Vùng Realtime
---

**Namespace** chia một server Socket.IO thành các kênh logic theo đường dẫn: `/flash-sale` cho hàng chờ và tồn kho, `/notifications` cho thông báo. Mỗi namespace có middleware xác thực, handler và room riêng, nhưng nhiều namespace có thể đi chung một kết nối vật lý (multiplexing). Đây là khái niệm của Socket.IO; WebSocket thuần không có.

Đọc thêm trong bài [[2026-11-22-websocket-rooms|Namespace, room và kết nối lại]].
