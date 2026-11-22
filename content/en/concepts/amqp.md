---
title: "AMQP"
description: "The standard protocol RabbitMQ uses to talk to applications, in versions 0-9-1 and 1.0."
tags: [rabbitmq, messaging]
type: note
region: Messaging Region
lang: en
---

**AMQP 0-9-1** is the protocol RabbitMQ has used from the start. It defines both the commands (`basic.publish`, `queue.declare`, `basic.ack`…) and the model inside the broker: exchanges, queues, bindings. Applications declare that structure themselves at startup. **AMQP 1.0** is a completely different protocol despite the name; it ships with RabbitMQ since 4.0 and is recommended for new applications.

Read more in [[en/posts/2026-11-21-rabbitmq-amqp-model|Inside the post office: the AMQP model]].
