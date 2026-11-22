---
title: "Queue và Log"
description: "Hai họ broker: queue xóa tin khi đã xử lý, log giữ tin để đọc lại."
tags: [rabbitmq, messaging]
type: note
region: Vùng Messaging
---

Trong **queue** (RabbitMQ classic, quorum), tin bị xóa khi consumer ack; muốn nhiều ứng dụng cùng đọc thì mỗi ứng dụng một queue. Trong **log** (Kafka, RabbitMQ stream), tin được ghi nối vào cuối và giữ theo thời hạn; mỗi consumer tự nhớ offset và đọc lại được. Queue mạnh ở định tuyến, ack từng tin, thư lỗi; log mạnh ở đọc lại và nhiều bên cùng đọc.

Đọc thêm trong bài [[posts/2026-11-21-rabbitmq-why-queues|Vì sao cần hàng đợi tin nhắn]].
