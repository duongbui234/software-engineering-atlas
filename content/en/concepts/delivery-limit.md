---
title: "Delivery Limit"
description: "The maximum number of failed deliveries of a message on a quorum queue before it is dead-lettered."
tags: [rabbitmq, messaging]
type: note
region: Messaging Region
lang: en
---

The **delivery limit** defaults to 20 since RabbitMQ 4.0 (unlimited in 3.13); past it, the message is dead-lettered with the reason `delivery_limit`. Since 4.3, `x-delivery-count` only increases on `reject`, a consumer crash or a lost connection; **`nack` with requeue is not counted**. A library that calls `nack(requeue)` on errors will loop forever on a 4.3+ quorum queue.

Read more in [[en/posts/2026-11-21-rabbitmq-queue-types|Classic, quorum or stream]].
