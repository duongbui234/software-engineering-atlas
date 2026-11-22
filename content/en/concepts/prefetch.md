---
title: "Prefetch"
description: "The maximum number of unacked messages the broker may deliver to one consumer."
tags: [rabbitmq, messaging]
type: note
region: Messaging Region
lang: en
---

**Prefetch** (`basic.qos`) limits the number of unacked messages on a consumer; once that count is reached, the broker stops delivering until the consumer acks some. Prefetch 1 hands work to whoever is free; with no prefetch, the broker pushes every message regardless of speed; 100–300 usually gives the best throughput for light work. `global` prefetch is blocked since RabbitMQ 4.3.

Read more in [[en/posts/2026-11-21-rabbitmq-ack-confirm|Reliable hand-offs: acks, prefetch, confirms]].
