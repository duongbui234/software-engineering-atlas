---
title: "Load Leveling"
description: "The queue holds the excess work when work arrives faster than it can be processed."
tags: [rabbitmq, messaging]
type: note
region: Messaging Region
lang: en
---

**Load leveling** uses a queue as a buffer: when 10,000 orders arrive in 10 seconds, the queue holds the excess and consumers work through it steadily at their own pace. To go faster, add consumers. A queue is not a bottomless bag: a queue that keeps growing will hit a resource alarm and RabbitMQ blocks every publisher, so you need a length limit.

Read more in [[en/posts/2026-11-21-rabbitmq-why-queues|Why we need a message queue]].
