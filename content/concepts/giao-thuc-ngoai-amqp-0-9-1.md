---
title: "Giao thức ngoài AMQP 0-9-1"
description: "AMQP 1.0, MQTT, STOMP và stream protocol trên cùng một broker."
tags: [rabbitmq, messaging]
type: note
region: Vùng Messaging
---

RabbitMQ 4.x có sẵn **AMQP 1.0** (cổng 5672, khuyên cho ứng dụng mới, kết quả `accepted`/`released`/`rejected`/`modified`), **MQTT** 3.1–5.0 cho IoT (cổng 1883, QoS 0 và 1), **STOMP** 1.0–1.2 (cổng 61613) và **stream protocol** (cổng 5552). Mọi giao thức dùng chung exchange và queue. `amqplib` chỉ hỗ trợ AMQP 0-9-1.

Đọc thêm trong bài [[2026-11-21-rabbitmq-operations|Vận hành RabbitMQ trong production]].
