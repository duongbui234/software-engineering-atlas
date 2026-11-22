---
title: "Clustering"
description: "Nhiều node RabbitMQ dùng chung siêu dữ liệu; nội dung chỉ có bản sao với quorum và stream."
tags: [rabbitmq, messaging]
type: note
region: Vùng Messaging
---

**Cụm** chép user, vhost, quyền, exchange, queue, binding, policy tới mọi node; client nối node nào cũng dùng được mọi queue. Nội dung classic queue vẫn chỉ ở một node. Các node cần chung Erlang cookie, thấy nhau ở cổng 4369 và 25672, cùng LAN, số node lẻ. Ghép node bằng `join_cluster` hoặc peer discovery.

Đọc thêm trong bài [[posts/2026-11-21-rabbitmq-cluster|Cụm và sẵn sàng cao]].
