---
title: "Producer và Consumer"
description: "Bên gửi tin cho broker và bên đăng ký nhận tin từ queue."
tags: [rabbitmq, messaging]
type: note
region: Vùng Messaging
---

**Producer** (publisher) là bên gửi tin cho broker; **consumer** là bên đăng ký nhận tin từ một queue và xử lý. Trong RabbitMQ, producer luôn gửi cho một exchange chứ không gửi thẳng vào queue, còn consumer nhận tin theo kiểu đẩy (`basic.consume`) và báo xong bằng ack. Một ứng dụng có thể vừa là producer vừa là consumer.

Đọc thêm trong bài [[2026-11-21-rabbitmq-why-queues|Vì sao cần hàng đợi tin nhắn]].
