---
title: "Queue and Log"
description: "Two broker families: a queue deletes messages once processed, a log keeps them for rereading."
tags: [rabbitmq, messaging]
type: note
region: Messaging Region
lang: en
---

In a **queue** (RabbitMQ classic, quorum), a message is deleted when the consumer acks it; for several applications to read the same messages, each needs its own queue. In a **log** (Kafka, RabbitMQ streams), messages are appended to the end and kept for a retention period; each consumer tracks its own offset and can reread. Queues are strong at routing, per-message acks and dead letters; logs are strong at rereading and many readers.

Read more in [[en/posts/2026-11-21-rabbitmq-why-queues|Why we need a message queue]].
