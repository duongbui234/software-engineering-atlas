---
title: "Backpressure"
description: "Khi bên nhận đọc chậm, bên gửi phải chậm lại hoặc bỏ bớt, không thì đệm phình trong RAM."
tags: ["realtime", "performance", "reliability"]
type: note
region: Vùng Realtime
---

**Backpressure**: `send()` của WebSocket không chặn; client đọc chậm (mạng 3G, tab ngủ) thì dữ liệu dồn trong bộ đệm của server, đo được qua `bufferedAmount`. Một server phát tồn kho mỗi 100 ms cho vài nghìn client chậm có thể dùng hết RAM. Cách xử lý: kiểm `bufferedAmount` rồi bỏ tin cũ (tin tồn kho chỉ cần bản mới nhất), gộp tin, hoặc ngắt client quá chậm.

Đọc thêm trong bài [[2026-11-22-websocket-security|An toàn và vận hành]].
