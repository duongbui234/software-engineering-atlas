---
title: "Policy"
description: "Cấu hình áp vào mọi queue hoặc exchange có tên khớp regex, đổi được lúc đang chạy."
tags: [rabbitmq, messaging]
type: note
region: Vùng Messaging
---

**Policy** đặt giới hạn độ dài, TTL, DLX, delivery limit… mà không phải khai báo lại queue. Mỗi đối tượng nhận một policy có priority cao nhất; tham số `x-` trên queue thắng policy thường. Loại queue và `x-max-priority` không đặt bằng policy được. **Operator policy** áp giới hạn trên: giá trị nhỏ hơn thắng.

Đọc thêm trong bài [[2026-11-21-rabbitmq-operations|Vận hành RabbitMQ trong production]].
