---
title: "Connection"
description: "Kết nối TCP sống lâu, có đăng nhập, từ ứng dụng tới broker."
tags: [rabbitmq, messaging]
type: note
region: Vùng Messaging
---

**Connection** là một kết nối TCP (có thể có TLS) từ ứng dụng tới RabbitMQ. Mở connection tốn kém và mỗi connection chiếm RAM cùng file handle ở broker, nên mở một lần khi ứng dụng khởi động và dùng mãi. Hơn khoảng 100 connection mới mỗi giây là dấu hiệu quản lý kết nối sai. Heartbeat (khuyên 5–20 giây) giúp phát hiện kết nối chết sớm.

Đọc thêm trong bài [[posts/2026-11-21-rabbitmq-amqp-model|Bên trong bưu điện: mô hình AMQP]].
