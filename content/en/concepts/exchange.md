---
title: "Exchange"
description: "The sorting desk: receives messages from producers and decides which queues to copy them into."
tags: [rabbitmq, messaging]
type: note
region: Messaging Region
lang: en
---

An **exchange** receives messages from producers and, based on its type (direct, fanout, topic, headers) and its bindings, copies each message into the matching queues. An exchange does not store messages: if no queue matches, the message is dropped, unless `mandatory` or an alternate exchange is in place. An exchange has a name, a type, and the `durable` and `auto-delete` flags.

Read more in [[en/posts/2026-11-21-rabbitmq-amqp-model|Inside the post office: the AMQP model]].
