---
title: "Policy"
description: "Configuration applied to every queue or exchange whose name matches a regex, changeable at runtime."
tags: [rabbitmq, messaging]
type: note
region: Messaging Region
lang: en
---

A **policy** sets length limits, TTL, DLX, delivery limit and so on without redeclaring the queue. Each object gets the one policy with the highest priority; `x-` arguments on the queue beat regular policies. The queue type and `x-max-priority` cannot be set by policy. An **operator policy** sets upper limits: the smaller value wins.

Read more in [[en/posts/2026-11-21-rabbitmq-operations|Running RabbitMQ in production]].
