---
title: "Delayed Message"
description: "Tin chỉ được giao sau một thời điểm định trước."
tags: [rabbitmq, messaging]
type: note
region: Vùng Messaging
---

Plugin delayed message exchange (`x-delayed-message`) từng phổ biến nhưng đã ngừng bảo trì vì RabbitMQ 4.3 bỏ Mnesia. Thay thế: queue chờ có TTL cộng DLX, hoặc từ RabbitMQ **4.4**, gửi vào quorum queue kèm header `x-opt-delivery-time` (epoch mili giây, kiểu long): tin vào queue ngay và được nhân bản, nhưng chỉ được giao khi tới giờ.

Đọc thêm trong bài [[2026-11-21-rabbitmq-dlx-retry|Thư lỗi và thư hẹn giờ]].
