---
title: "Auto-ack"
description: "A message counts as done the moment it is sent; if the consumer dies, the message is lost."
tags: [rabbitmq, messaging]
type: note
region: Messaging Region
lang: en
---

**Auto-ack** (`noAck: true`) tells the broker to delete the message as soon as it is written to the network. It is faster, but a consumer that dies midway loses the message, and prefetch no longer applies, so the consumer can be flooded. The RabbitMQ docs call this mode unsafe. `amqplib` defaults to manual acks, while NestJS `Transport.RMQ` defaults to `noAck: true`.

Read more in [[en/posts/2026-11-21-rabbitmq-ack-confirm|Reliable hand-offs: acks, prefetch, confirms]].
