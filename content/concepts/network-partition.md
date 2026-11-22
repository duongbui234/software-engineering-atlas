---
title: "Network Partition"
description: "Các node vẫn sống nhưng không thấy nhau; Raft quyết định phía nào chạy tiếp."
tags: [rabbitmq, messaging]
type: note
region: Vùng Messaging
---

Trước 4.3, RabbitMQ có các chiến lược `pause_minority`, `autoheal`, `ignore`. Từ **4.3** chúng bị gỡ, khóa cấu hình không còn tác dụng: phía có đa số chạy tiếp và bầu leader nếu cần, phía thiểu số không ghi được, khi nối lại thì tự bắt kịp. Tin unacked có thể bị giao lại. Cụm 2 node không chịu được partition nào.

Đọc thêm trong bài [[posts/2026-11-21-rabbitmq-cluster|Cụm và sẵn sàng cao]].
