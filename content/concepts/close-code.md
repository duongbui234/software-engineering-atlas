---
title: "Close Code"
description: "Mã 2 byte trong frame close cho biết vì sao kết nối đóng: 1000 bình thường, 1008 vi phạm chính sách…"
tags: ["realtime", "websocket"]
type: note
region: Vùng Realtime
---

**Close code**: frame close mang mã 2 byte và lý do dạng chữ. 1000 là đóng bình thường, 1001 là bên kia rời đi (server tắt, tab đóng), 1008 vi phạm chính sách, 1009 tin quá lớn, 1011 lỗi server. Mã 1006 không bao giờ được gửi trên dây: client tự gán khi kết nối mất mà không có frame close, và đó là tín hiệu nên kết nối lại.

Đọc thêm trong bài [[2026-11-22-websocket-protocol|Bên trong giao thức WebSocket]].
