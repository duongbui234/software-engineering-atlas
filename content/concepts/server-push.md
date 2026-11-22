---
title: "Server Push"
description: "Server chủ động gửi dữ liệu cho client mà không chờ client hỏi."
tags: ["realtime", "http"]
type: note
region: Vùng Realtime
---

**Server push** là khi server tự gửi tin cho client lúc có chuyện xảy ra (tồn kho đổi, tới lượt thanh toán), thay vì chờ client hỏi. HTTP thuần không làm được việc này: mỗi response phải đi kèm một request. Mọi kỹ thuật realtime trên web (long polling, SSE, WebSocket) là các cách khác nhau để giả lập hoặc mở ra đường đi ngược chiều đó.

Đọc thêm trong bài [[2026-11-22-websocket-realtime-options|Bốn cách để server báo tin]].
