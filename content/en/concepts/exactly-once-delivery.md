---
title: "Exactly-once Delivery"
description: "The \"processed exactly once\" promise that RabbitMQ does not make."
tags: [rabbitmq, messaging]
type: note
region: Messaging Region
lang: en
---

Processing and acking are two operations in two different systems (your database and the broker) with no shared transaction, so there is always a moment of "done, not yet reported". RabbitMQ does not promise **exactly-once**. The practical approach everywhere is at-least-once plus an idempotent consumer, which has the effect of exactly once.

Read more in [[en/posts/2026-11-21-rabbitmq-delivery-guarantees|No loss, no duplicates]].
