---
title: "Default Exchange"
description: "A nameless direct exchange to which every queue is bound with its own name as the key."
tags: [rabbitmq, messaging]
type: note
region: Messaging Region
lang: en
---

The **default exchange** has the empty name `""`. Every queue is automatically bound to it with a binding key equal to the queue's name, and nobody can bind or unbind manually. So `sendToQueue(q, ...)` is really `publish("", q, ...)`. Handy for small examples, but the producer must know the queue name, which means knowing the consumer. The default exchange does not support an alternate exchange.

Read more in [[en/posts/2026-11-21-rabbitmq-exchanges|The four standard exchange types]].
