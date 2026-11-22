---
title: "Request-Reply"
description: "Asking through the broker and waiting for the answer with `reply_to` and `correlation_id`."
tags: [rabbitmq, messaging]
type: note
region: Messaging Region
lang: en
---

**Request-reply** (RPC over a broker): the request carries `reply_to` (the queue for the answer) and `correlation_id` (the request ID); the responder publishes the result to the default exchange with the routing key set to `reply_to`. **Direct Reply-to** uses the pseudo-queue `amq.rabbitmq.reply-to`, requires `noAck` and the same channel, and is at-most-once. Always set a timeout on the requesting side.

Read more in [[en/posts/2026-11-21-rabbitmq-delivery-guarantees|No loss, no duplicates]].
