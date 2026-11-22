---
title: "Dead Letter Exchange"
description: "The exchange that receives \"dead\" messages: rejected, expired, pushed out, or over the delivery limit."
tags: [rabbitmq, messaging]
type: note
region: Messaging Region
lang: en
---

A message is **dead-lettered** when it is `reject`ed or `nack`ed without requeue, its TTL runs out, it is pushed out because the queue is full, or it exceeds the delivery limit. A DLX is an ordinary exchange named through a policy or `x-dead-letter-exchange`. The `x-death` header records the queue, the reason and how many times the message died. If no queue is bound to the DLX, dead messages vanish silently.

Read more in [[en/posts/2026-11-21-rabbitmq-dlx-retry|Dead letters and scheduled letters]].
