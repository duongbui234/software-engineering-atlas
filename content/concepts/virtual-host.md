---
title: "Virtual Host"
description: "Không gian tách biệt tên, quyền và chính sách trong một broker."
tags: [rabbitmq, messaging]
type: note
region: Vùng Messaging
---

**Virtual host** (vhost) chia một broker thành nhiều chi nhánh, mỗi chi nhánh có exchange, queue, binding, quyền và policy riêng; vhost mặc định là `/`. User được cấp quyền theo vhost, và mỗi vhost đặt được giới hạn số connection, số queue. Vhost chỉ tách về logic: mọi vhost dùng chung RAM, CPU và đĩa của broker.

Đọc thêm trong bài [[posts/2026-11-21-rabbitmq-amqp-model|Bên trong bưu điện: mô hình AMQP]].
