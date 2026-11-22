---
title: "Raft"
description: "A consensus algorithm: one leader, majority writes, the minority stands still."
tags: [rabbitmq, messaging]
type: note
region: Messaging Region
lang: en
---

**Raft** lets several machines agree on a sequence of changes even when some machines die or the network is cut. There is one leader at a time; an entry counts as written only when a majority has copied it; during a partition, the minority side cannot elect a leader and so cannot write. RabbitMQ uses Raft for quorum queues, streams and the Khepri metadata store. Use odd numbers: 3 tolerates 1 dead node, 5 tolerates 2.

Read more in [[en/posts/2026-11-21-rabbitmq-queue-types|Classic, quorum or stream]].
