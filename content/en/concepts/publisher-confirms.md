---
title: "Publisher Confirms"
description: "The confirm the broker sends to the producer once it has taken responsibility for a message."
tags: [rabbitmq, messaging]
type: note
region: Messaging Region
lang: en
---

With **confirm mode** on a channel, the broker sends a `basic.ack` for each message once it has taken responsibility: for a persistent message in a durable queue, after writing it to disk; for a quorum queue, when a majority of replicas have it; for an unroutable message, as soon as it knows there is no queue. A `basic.nack` comes when the broker could not take the message. Waiting in batches is many times faster than waiting for each message; transactions are up to about 250 times slower.

Read more in [[en/posts/2026-11-21-rabbitmq-ack-confirm|Reliable hand-offs: acks, prefetch, confirms]].
