---
title: "Single Active Consumer"
description: "Several consumers subscribe but only one receives messages at a time, with automatic failover when it leaves."
tags: [rabbitmq, messaging]
type: note
region: Messaging Region
lang: en
---

Enable it with `x-single-active-consumer: true` when declaring the queue (classic, quorum; streams through the stream protocol). It keeps processing in order while still having standby consumers. The cost is no parallel processing on that queue. It differs from an exclusive consumer (classic only): a later subscriber is refused instead of waiting as a standby.

Read more in [[en/posts/2026-11-21-rabbitmq-queue-types|Classic, quorum or stream]].
