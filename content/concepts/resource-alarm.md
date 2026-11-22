---
title: "Resource Alarm"
description: "Một node vượt ngưỡng RAM hoặc thiếu đĩa thì mọi publisher của cả cụm bị chặn."
tags: [rabbitmq, messaging]
type: note
region: Vùng Messaging
---

Memory alarm bật khi RAM vượt `vm_memory_high_watermark` (mặc định 0,6; container nên đặt giá trị tuyệt đối); disk alarm bật khi đĩa trống dưới `disk_free_limit` (mặc định 50 MB, production nên đặt gần bằng RAM). Khi đó mọi connection đang gửi trên toàn cụm bị chặn, consumer vẫn chạy; client nhận sự kiện `connection.blocked`.

Đọc thêm trong bài [[posts/2026-11-21-rabbitmq-operations|Vận hành RabbitMQ trong production]].
