---
title: "Classic Queue"
description: "The default queue type; messages live on one node with no replicas."
tags: [rabbitmq, messaging]
type: note
region: Messaging Region
lang: en
---

A **classic queue** keeps its messages on one node. Mirrored queues (`ha-mode`) were removed in 4.0; lazy mode has been ignored since 3.12. Classic queues support exclusive, auto-delete, TTL, length limits, priority and DLX, but they cannot survive a node failure and have no delivery limit. They suit temporary queues, a consumer's private queue, RPC and data you can afford to lose.

Read more in [[en/posts/2026-11-21-rabbitmq-queue-types|Classic, quorum or stream]].
