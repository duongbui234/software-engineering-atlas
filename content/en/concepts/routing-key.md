---
title: "Routing Key"
description: "The label a producer puts on each message when publishing, for the exchange to compare with binding keys."
tags: [rabbitmq, messaging]
type: note
region: Messaging Region
lang: en
---

The **routing key** lives on the message and is set by the producer, for example `order.cancelled`. The **binding key** lives on the binding, for example `order.*`. The exchange compares the two by the rules of its type. A typo in either one makes the message go astray without any error. For a topic exchange, the routing key is words joined by dots.

Read more in [[en/posts/2026-11-21-rabbitmq-amqp-model|Inside the post office: the AMQP model]].
