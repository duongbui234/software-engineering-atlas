---
title: "Server-Sent Events"
description: "Một response HTTP không bao giờ kết thúc, server ghi từng sự kiện dạng text, chỉ một chiều."
tags: ["realtime", "http"]
type: note
region: Vùng Realtime
---

**Server-Sent Events** (SSE, `EventSource` trong trình duyệt): response có `Content-Type: text/event-stream`, server ghi các dòng `data: …` mỗi khi có tin. Trình duyệt tự kết nối lại và gửi `Last-Event-ID` để server phát bù. Chỉ server → client, chỉ text; trên HTTP/1.1 bị giới hạn 6 kết nối mỗi tên miền, HTTP/2 thì không.

Đọc thêm trong bài [[posts/2026-11-22-websocket-realtime-options|Bốn cách để server báo tin]].
