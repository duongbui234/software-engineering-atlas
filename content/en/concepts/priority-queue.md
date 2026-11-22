---
title: "Priority Queue"
description: "High-priority messages are delivered before regular messages waiting in the same queue."
tags: [rabbitmq, messaging]
type: note
region: Messaging Region
lang: en
---

A classic queue must declare `x-max-priority` (fewer than 10 levels recommended; it cannot be set by policy). Quorum queues since 4.3 have 32 built-in levels with strict priority, and a message with no priority is level 4. Priority only matters when the queue has a backlog, and a large prefetch makes it less effective. This differs from consumer priority, where consumers are ranked.

Read more in [[en/posts/2026-11-21-rabbitmq-dlx-retry|Dead letters and scheduled letters]].
