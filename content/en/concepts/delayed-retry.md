---
title: "Delayed Retry"
description: "Retrying after a wait instead of requeueing immediately."
tags: [rabbitmq, messaging]
type: note
region: Messaging Region
lang: en
---

The classic pattern: the main queue has a DLX pointing to a waiting queue with a TTL and no consumers; when the TTL expires, the message is dead-lettered back to the main exchange. Count attempts with `x-death`, and after N attempts move the message to a parking lot. Each delay level needs its own waiting queue. Since RabbitMQ 4.3, quorum queues have built-in `x-delayed-retry-type`, `-min` and `-max`.

Read more in [[en/posts/2026-11-21-rabbitmq-dlx-retry|Dead letters and scheduled letters]].
