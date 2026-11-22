---
title: "Producer and Consumer"
description: "The side that publishes messages to the broker and the side that subscribes to a queue to receive them."
tags: [rabbitmq, messaging]
type: note
region: Messaging Region
lang: en
---

A **producer** (publisher) sends messages to the broker; a **consumer** subscribes to a queue to receive and process messages. In RabbitMQ, a producer always publishes to an exchange, never directly into a queue, while a consumer receives messages by push (`basic.consume`) and reports completion with an ack. One application can be both producer and consumer.

Read more in [[en/posts/2026-11-21-rabbitmq-why-queues|Why we need a message queue]].
