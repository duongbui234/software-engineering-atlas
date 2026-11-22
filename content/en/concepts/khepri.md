---
title: "Khepri"
description: "The Raft-based metadata store that replaces Mnesia; the only store since RabbitMQ 4.3."
tags: [rabbitmq, messaging]
type: note
region: Messaging Region
lang: en
---

**Khepri** stores the cluster's metadata with Raft: experimental in 3.13, official in 4.0, the default for new clusters in 4.2, and since 4.3 Mnesia is removed entirely. The consequence: a cluster needs a majority of nodes up to start and to change metadata. On Kubernetes, let the RabbitMQ pods start in parallel.

Read more in [[en/posts/2026-11-21-rabbitmq-cluster|Clusters and high availability]].
