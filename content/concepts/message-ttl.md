---
title: "Message TTL"
description: "Thời hạn sống của tin, đặt theo queue hoặc từng tin."
tags: [rabbitmq, messaging]
type: note
region: Vùng Messaging
---

**TTL** đặt bằng `x-message-ttl` cho cả queue hoặc property `expiration` (chuỗi mili giây) cho từng tin; có cả hai thì lấy giá trị nhỏ hơn. Tin hết hạn chỉ bị xóa hoặc dead-letter khi lên đầu hàng, nên tin hạn ngắn có thể kẹt sau tin hạn dài. `x-expires` là TTL của chính queue: queue không dùng tới sẽ bị xóa.

Đọc thêm trong bài [[2026-11-21-rabbitmq-dlx-retry|Thư lỗi và thư hẹn giờ]].
