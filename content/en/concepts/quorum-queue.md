---
title: "Quorum Queue"
description: "A queue replicated across several nodes with Raft; use it for important data."
tags: [rabbitmq, messaging]
type: note
region: Messaging Region
lang: en
---

A **quorum queue** has one leader and followers on different nodes (3 replicas by default). A write takes effect once a majority has copied it; the confirm is sent at that point. If the leader dies, the remaining majority elects a new one; if the majority is lost, the queue stops. Always durable, never exclusive, no global QoS; it has a delivery limit, at-least-once dead-lettering, delayed retry (4.3) and scheduled delivery (4.4).

Read more in [[en/posts/2026-11-21-rabbitmq-queue-types|Classic, quorum or stream]].
