---
title: "Queue"
description: "Hộc thư: nơi tin thật sự nằm chờ theo thứ tự cho tới khi consumer lấy."
tags: [rabbitmq, messaging]
type: note
region: Vùng Messaging
---

**Queue** giữ tin theo thứ tự tới trước ra trước. Thuộc tính chính: tên, `durable` (còn sau khi broker khởi động lại), `exclusive` (chỉ connection đã khai báo dùng được), `auto-delete`, và các tham số `x-` như loại queue, TTL, giới hạn độ dài. Từ RabbitMQ 4.3, queue không durable phải là exclusive. Khai báo lại với thuộc tính khác là lỗi 406.

Đọc thêm trong bài [[2026-11-21-rabbitmq-amqp-model|Bên trong bưu điện: mô hình AMQP]].
