---
title: "Direct Exchange"
description: "Copies a message into queues whose binding key exactly matches the routing key."
tags: [rabbitmq, messaging]
type: note
region: Messaging Region
lang: en
---

A **direct exchange** copies a message only when the binding key is identical to the routing key: the binding `payment.paid` receives exactly `payment.paid`. If several queues bind with the same key, each gets a copy. It fits when keys form a fixed set, such as command types or log levels. The built-in `amq.direct` exchange is available.

Read more in [[en/posts/2026-11-21-rabbitmq-exchanges|The four standard exchange types]].
