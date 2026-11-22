---
title: "Delivery Limit"
description: "Số lần giao thất bại tối đa của một tin trên quorum queue trước khi bị dead-letter."
tags: [rabbitmq, messaging]
type: note
region: Vùng Messaging
---

**Delivery limit** mặc định là 20 từ RabbitMQ 4.0 (3.13 không giới hạn); vượt quá thì tin bị dead-letter với lý do `delivery_limit`. Từ 4.3, `x-delivery-count` chỉ tăng khi `reject`, consumer chết hoặc mất kết nối; **`nack` có requeue không được đếm**. Thư viện dùng `nack(requeue)` khi lỗi sẽ lặp vô hạn trên quorum queue 4.3+.

Đọc thêm trong bài [[posts/2026-11-21-rabbitmq-queue-types|Classic, quorum hay stream]].
