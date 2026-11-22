---
title: "Consumer Acknowledgement"
description: "The consumer reports \"done\" and only then does the broker delete the message."
tags: [rabbitmq, messaging]
type: note
region: Messaging Region
lang: en
---

With **manual acks**, a delivered message stays unacked until the consumer sends `basic.ack`. If the channel closes while messages are still unacked, they go back to the queue. `basic.reject` and `basic.nack` refuse a message: with `requeue` true it returns to the queue, with false it is dropped or dead-lettered. Requeue is not retry: the message is redelivered almost immediately. The ack is the last thing a handler does.

Read more in [[en/posts/2026-11-21-rabbitmq-ack-confirm|Reliable hand-offs: acks, prefetch, confirms]].
