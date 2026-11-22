---
title: "Resource Alarm"
description: "When one node exceeds its RAM threshold or runs low on disk, every publisher in the cluster is blocked."
tags: [rabbitmq, messaging]
type: note
region: Messaging Region
lang: en
---

The memory alarm fires when RAM exceeds `vm_memory_high_watermark` (default 0.6; in containers, set an absolute value); the disk alarm fires when free disk drops below `disk_free_limit` (default 50 MB; in production, set it close to the RAM size). Then every publishing connection across the whole cluster is blocked, while consumers keep running; clients receive a `connection.blocked` event.

Read more in [[en/posts/2026-11-21-rabbitmq-operations|Running RabbitMQ in production]].
