---
title: "Queue"
description: "The mail slot: where messages actually wait in order until a consumer takes them."
tags: [rabbitmq, messaging]
type: note
region: Messaging Region
lang: en
---

A **queue** holds messages first in, first out. Its main properties: a name, `durable` (survives a broker restart), `exclusive` (usable only by the connection that declared it), `auto-delete`, and `x-` arguments such as the queue type, TTL and length limits. Since RabbitMQ 4.3, a non-durable queue must be exclusive. Redeclaring with different properties is a 406 error.

Read more in [[en/posts/2026-11-21-rabbitmq-amqp-model|Inside the post office: the AMQP model]].
