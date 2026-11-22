---
title: "Raft"
description: "Thuật toán đồng thuận: một leader, ghi theo đa số, nhóm thiểu số đứng im."
tags: [rabbitmq, messaging]
type: note
region: Vùng Messaging
---

**Raft** cho nhiều máy đồng ý về một chuỗi thay đổi dù vài máy chết hay mạng bị cắt. Có một leader tại một thời điểm; một mục chỉ được coi là đã ghi khi đa số đã chép; phía thiểu số khi mạng chia không bầu được leader nên không ghi. RabbitMQ dùng Raft cho quorum queue, stream và kho siêu dữ liệu Khepri. Số lẻ: 3 chịu 1 node chết, 5 chịu 2.

Đọc thêm trong bài [[posts/2026-11-21-rabbitmq-queue-types|Classic, quorum hay stream]].
