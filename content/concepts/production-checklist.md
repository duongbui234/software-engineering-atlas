---
title: "Production Checklist"
description: "Những điều phải có trước khi đưa RabbitMQ lên production."
tags: [rabbitmq, messaging]
type: note
region: Vùng Messaging
---

Cụm 3 hoặc 5 node cùng LAN; mỗi node từ 4 CPU, 4 GiB RAM, SSD; đặt ngưỡng RAM và đĩa; file descriptor từ 50.000. Xóa `guest`, mỗi ứng dụng một user, TLS. Dữ liệu quan trọng ở quorum queue; mọi queue có giới hạn độ dài và DLX qua policy. Confirm, persistent, ack thủ công, prefetch hữu hạn, consumer idempotent. Connection sống lâu, tách gửi và nhận. Prometheus và cảnh báo.

Đọc thêm trong bài [[2026-11-21-rabbitmq-operations|Vận hành RabbitMQ trong production]].
