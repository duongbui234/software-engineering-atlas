---
title: "Long Polling"
description: "Server giữ request lại tới khi có tin hoặc hết giờ, rồi client hỏi tiếp ngay."
tags: ["realtime", "http"]
type: note
region: Vùng Realtime
---

**Long polling**: server không trả lời ngay mà giữ request treo tới khi có sự kiện (hoặc hết thời gian chờ), client nhận xong lại gửi request mới. Độ trễ gần như tức thì và chạy trên HTTP thường, nên đây là đường lui của Socket.IO khi WebSocket bị chặn. Cái giá: mỗi tin tốn một request, và nhiều server phải biết request nào thuộc phiên nào.

Đọc thêm trong bài [[posts/2026-11-22-websocket-realtime-options|Bốn cách để server báo tin]].
