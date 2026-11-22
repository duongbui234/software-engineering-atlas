---
title: "Delayed Message"
description: "A message that is delivered only after a set time."
tags: [rabbitmq, messaging]
type: note
region: Messaging Region
lang: en
---

The delayed message exchange plugin (`x-delayed-message`) used to be popular but is no longer maintained, because RabbitMQ 4.3 dropped Mnesia. Replacements: a waiting queue with TTL plus DLX, or from RabbitMQ **4.4**, publishing to a quorum queue with the `x-opt-delivery-time` header (epoch milliseconds, type long): the message enters the queue immediately and is replicated, but is delivered only when its time comes.

Read more in [[en/posts/2026-11-21-rabbitmq-dlx-retry|Dead letters and scheduled letters]].
