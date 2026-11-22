---
title: "Long-lived Token"
description: "Token được kiểm lúc bắt tay hết hạn sau 15 phút, nhưng kết nối có thể sống hàng giờ."
tags: ["realtime", "security", "auth"]
type: note
region: Vùng Realtime
---

**Token sống lâu hơn hạn của nó**: kết nối WebSocket chỉ kiểm token lúc bắt tay, nên access token 15 phút vẫn mở được một kết nối sống ba giờ, kể cả khi người dùng đã bị khóa. Cách vá: hẹn giờ ngắt đúng lúc `exp`, kiểm lại định kỳ hoặc trong middleware của mỗi sự kiện, và cho client gửi token mới (hoặc nối lại) trước khi token cũ hết hạn.

Đọc thêm trong bài [[posts/2026-11-22-websocket-security|An toàn và vận hành]].
