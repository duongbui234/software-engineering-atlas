---
title: "Redelivery"
description: "An unacked message returns to the queue and is delivered again with the `redelivered = true` flag."
tags: [rabbitmq, messaging]
type: note
region: Messaging Region
lang: en
---

**Redelivery** happens when a consumer dies, loses its connection, or `nack`s/`reject`s with requeue. A redelivered message carries `redelivered = true`. `false` guarantees the message was never delivered before; `true` only means it *may* have been processed. The flag is not enough for deduplication, because a producer's resend still has `redelivered = false`.

Read more in [[en/posts/2026-11-21-rabbitmq-ack-confirm|Reliable hand-offs: acks, prefetch, confirms]].
