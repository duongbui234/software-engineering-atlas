---
title: "Message Persistence"
description: "The three conditions for a message to survive a broker restart."
tags: [rabbitmq, messaging]
type: note
region: Messaging Region
lang: en
---

A message survives a restart only with all of these: a durable queue (or quorum/stream), a persistent message (`delivery_mode = 2`), and publisher confirms to know the message was really written, because the broker does not `fsync` each message right away. Missing any one leaves a gap. All three protect a message on one node only; to survive a node failure you need a quorum queue.

Read more in [[en/posts/2026-11-21-rabbitmq-ack-confirm|Reliable hand-offs: acks, prefetch, confirms]].
