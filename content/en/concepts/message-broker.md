---
title: "Message Broker"
description: "Middleware that receives, holds and forwards messages between services."
tags: [rabbitmq, messaging]
type: note
region: Messaging Region
lang: en
---

A **message broker** is a separate program that receives messages from producers, stores them in queues and passes them to consumers. The two sides no longer talk to each other directly; both talk to the broker. RabbitMQ is the most popular open-source broker; it speaks AMQP 0-9-1, and since 4.x also AMQP 1.0, MQTT and STOMP.

Read more in [[en/posts/2026-11-21-rabbitmq-why-queues|Why we need a message queue]].
