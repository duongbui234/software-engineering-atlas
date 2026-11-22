---
title: "Exactly-once Delivery"
description: "Lời hứa \"xử lý đúng một lần\" mà RabbitMQ không đưa ra."
tags: [rabbitmq, messaging]
type: note
region: Vùng Messaging
---

Xử lý và ack là hai thao tác ở hai hệ thống khác nhau (database của bạn và broker), không có transaction chung, nên luôn có khoảnh khắc "đã làm, chưa báo". RabbitMQ không hứa **exactly-once**. Cách thực tế ở mọi nơi là at-least-once cộng consumer idempotent, cho hiệu quả như đúng một lần.

Đọc thêm trong bài [[posts/2026-11-21-rabbitmq-delivery-guarantees|Không mất, không trùng]].
