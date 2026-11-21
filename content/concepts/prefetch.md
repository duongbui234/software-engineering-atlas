---
title: "Prefetch"
description: "Số tin chưa ack tối đa mà broker được giao cho một consumer."
tags: [rabbitmq, messaging]
type: note
region: Vùng Messaging
---

**Prefetch** (`basic.qos`) giới hạn số tin unacked trên một consumer; đủ số đó thì broker ngừng giao cho tới khi consumer ack bớt. Prefetch 1 chia việc theo ai rảnh nhất; không đặt thì broker đẩy hết tin bất kể tốc độ; 100–300 thường cho throughput tốt nhất với việc nhẹ. Prefetch kiểu `global` bị chặn từ RabbitMQ 4.3.

Đọc thêm trong bài [[2026-11-21-rabbitmq-ack-confirm|Giao nhận chắc tay: ack, prefetch, confirm]].
