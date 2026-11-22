---
title: "Queue Length Limit"
description: "A limit on a queue's message count or byte size, and what happens when it is full."
tags: [rabbitmq, messaging]
type: note
region: Messaging Region
lang: en
---

`x-max-length` and `x-max-length-bytes` limit the ready messages in a queue. When it is full, `x-overflow` decides: `drop-head` (the default, drops the oldest message), `reject-publish` (refuses new messages, the producer gets a nack) or `reject-publish-dlx` (refuses and dead-letters; not available on quorum queues). A limit is the cheapest way to keep one dead consumer from dragging the whole broker into a memory alarm.

Read more in [[en/posts/2026-11-21-rabbitmq-dlx-retry|Dead letters and scheduled letters]].
