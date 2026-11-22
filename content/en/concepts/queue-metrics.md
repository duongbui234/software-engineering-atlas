---
title: "Queue Metrics"
description: "The numbers that tell you whether consumers keep up: ready, unacked, consumers."
tags: [rabbitmq, messaging]
type: note
region: Messaging Region
lang: en
---

A steadily rising `messages_ready` means consumers cannot keep up or have died; a high `messages_unacked` that never drops means a consumer is stuck or forgot to ack; `consumers` at 0 on a queue that is receiving messages is an alarm. Consumer capacity below 100% while there is a backlog means you need more consumers or a higher prefetch. Monitor with the Prometheus plugin (port 15692) and Grafana.

Read more in [[en/posts/2026-11-21-rabbitmq-operations|Running RabbitMQ in production]].
