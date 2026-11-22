---
title: "Reconnect Storm"
description: "Một pod tắt, hàng nghìn client kết nối lại cùng lúc; jitter rải chúng ra theo thời gian."
tags: ["realtime", "reliability", "scaling"]
type: note
region: Vùng Realtime
---

**Reconnect storm** (thundering herd khi nối lại): pod chết hay deploy làm mọi client của nó mất kết nối cùng một lúc, và nếu tất cả chờ đúng 1 giây rồi nối lại thì các pod còn lại nhận một cú dồn bắt tay, xác thực, subscribe. Socket.IO rải ra bằng `randomizationFactor` (mặc định 0,5): trong ví dụ, 10.000 client rơi vào 10 khung 100 ms thay vì 1.

Đọc thêm trong bài [[2026-11-22-websocket-scaling|Chạy trên nhiều pod]].
