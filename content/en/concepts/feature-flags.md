---
title: "Feature Flags"
description: "New features turn on only once every node supports them, so nodes can be upgraded one by one safely."
tags: [rabbitmq, messaging]
type: note
region: Messaging Region
lang: en
---

**Feature flags** let nodes of different versions run together during a rolling upgrade. Upgrade every node, then run `rabbitmqctl enable_feature_flag all`; once enabled, a flag cannot be disabled, and some flags must be enabled before the next upgrade. They come with a lifecycle for deprecated features: permitted, denied, disconnected, removed. From 3.13/4.0/4.1 you must go to 4.2 before moving to 4.3+.

Read more in [[en/posts/2026-11-21-rabbitmq-cluster|Clusters and high availability]].
