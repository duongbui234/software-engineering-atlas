---
title: "Routing Key"
description: "Nhãn producer dán lên từng tin lúc gửi, để exchange so với binding key."
tags: [rabbitmq, messaging]
type: note
region: Vùng Messaging
---

**Routing key** nằm trên tin nhắn, do producer đặt, ví dụ `order.cancelled`. **Binding key** nằm trên binding, ví dụ `order.*`. Exchange so hai thứ này theo luật của kiểu exchange. Gõ sai một trong hai là tin đi lạc mà không có lỗi. Với topic exchange, routing key là các từ nối bằng dấu chấm.

Đọc thêm trong bài [[2026-11-21-rabbitmq-amqp-model|Bên trong bưu điện: mô hình AMQP]].
