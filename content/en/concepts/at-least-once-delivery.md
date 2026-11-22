---
title: "At-least-once Delivery"
description: "No message is lost, but duplicates can arrive."
tags: [rabbitmq, messaging]
type: note
region: Messaging Region
lang: en
---

**At-least-once** needs manual acks, publisher confirms, a durable queue and persistent messages. In exchange, a message may arrive twice: the consumer dies after finishing the work but before acking, the producer resends because it saw no confirm, or a quorum queue changes leader. The opposite, at-most-once (auto-ack, no confirms), can lose messages but never duplicates them.

Read more in [[en/posts/2026-11-21-rabbitmq-delivery-guarantees|No loss, no duplicates]].
