---
title: "Network Partition"
description: "The nodes are still alive but cannot see each other; Raft decides which side keeps going."
tags: [rabbitmq, messaging]
type: note
region: Messaging Region
lang: en
---

Before 4.3, RabbitMQ had the `pause_minority`, `autoheal` and `ignore` strategies. In **4.3** they were removed and the config key no longer has any effect: the majority side keeps running and elects a leader if needed, the minority side cannot write, and when the network heals it catches up on its own. Unacked messages may be redelivered. A 2-node cluster cannot survive any partition.

Read more in [[en/posts/2026-11-21-rabbitmq-cluster|Clusters and high availability]].
