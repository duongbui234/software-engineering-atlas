---
title: "Message Broker"
description: "Phần mềm đứng giữa, nhận tin, giữ hộ và chuyển tin giữa các dịch vụ."
tags: [rabbitmq, messaging]
type: note
region: Vùng Messaging
---

**Message broker** là một chương trình chạy riêng, chuyên nhận tin từ bên gửi, cất vào hàng đợi và chuyển cho bên nhận. Hai bên không nói chuyện trực tiếp với nhau nữa mà cùng nói chuyện với broker. RabbitMQ là broker mã nguồn mở phổ biến nhất, nói giao thức AMQP 0-9-1, và từ 4.x thêm AMQP 1.0, MQTT, STOMP.

Đọc thêm trong bài [[posts/2026-11-21-rabbitmq-why-queues|Vì sao cần hàng đợi tin nhắn]].
