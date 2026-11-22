---
title: "Flow Control"
description: "Back-pressure inside the broker that slows down a connection publishing too fast."
tags: [rabbitmq, messaging]
type: note
region: Messaging Region
lang: en
---

When any stage in the message pipeline (channel, queue, disk write, replication) is slow, pressure propagates back to the publishing connection; the connection shows the `flow` state and is blocked and unblocked many times per second. Connections that only consume are not throttled, so separate publishing and consuming connections. A long-lasting `flow` state means the broker is at its limit.

Read more in [[en/posts/2026-11-21-rabbitmq-operations|Running RabbitMQ in production]].
