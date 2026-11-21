---
title: "AMQP"
description: "Giao thức chuẩn RabbitMQ dùng để nói chuyện với ứng dụng, bản 0-9-1 và 1.0."
tags: [rabbitmq, messaging]
type: note
region: Vùng Messaging
---

**AMQP 0-9-1** là giao thức RabbitMQ dùng từ đầu. Nó quy định cả các lệnh (`basic.publish`, `queue.declare`, `basic.ack`…) lẫn mô hình bên trong broker: exchange, queue, binding. Ứng dụng tự khai báo cấu trúc đó lúc khởi động. **AMQP 1.0** là một giao thức khác hẳn dù cùng tên, có sẵn trong RabbitMQ từ 4.0 và được khuyên cho ứng dụng mới.

Đọc thêm trong bài [[2026-11-21-rabbitmq-amqp-model|Bên trong bưu điện: mô hình AMQP]].
