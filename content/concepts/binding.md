---
title: "Binding"
description: "Quy tắc nối exchange với queue: chép tin vào queue khi nhãn khớp mẫu."
tags: [rabbitmq, messaging]
type: note
region: Vùng Messaging
---

**Binding** nói "exchange E chép tin vào queue Q khi routing key khớp binding key K". Một queue có thể có nhiều binding, một exchange có thể bind tới nhiều queue, và khi đó mỗi queue khớp nhận một bản. Thêm bên nghe chỉ cần thêm queue và binding. Binding cũng có thể nối exchange với exchange.

Đọc thêm trong bài [[2026-11-21-rabbitmq-amqp-model|Bên trong bưu điện: mô hình AMQP]].
