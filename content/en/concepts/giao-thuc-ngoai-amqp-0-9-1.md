---
title: "Protocols Beyond AMQP 0-9-1"
description: "AMQP 1.0, MQTT, STOMP and the stream protocol on the same broker."
tags: [rabbitmq, messaging]
type: note
region: Messaging Region
lang: en
---

RabbitMQ 4.x ships with **AMQP 1.0** (port 5672, recommended for new applications, outcomes `accepted`/`released`/`rejected`/`modified`), **MQTT** 3.1–5.0 for IoT (port 1883, QoS 0 and 1), **STOMP** 1.0–1.2 (port 61613) and the **stream protocol** (port 5552). All protocols share the same exchanges and queues. `amqplib` supports only AMQP 0-9-1.

Read more in [[en/posts/2026-11-21-rabbitmq-operations|Running RabbitMQ in production]].
