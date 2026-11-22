---
title: "Federation"
description: "Links distant clusters: an exchange or queue in one cluster receives messages from another."
tags: [rabbitmq, messaging]
type: note
region: Messaging Region
lang: en
---

**Federation** works over a WAN, between clusters of different versions. A **federated exchange** receives copies of the messages published to the exchange of the same name upstream. A **federated queue** pulls messages from upstream when it has consumers but no messages. It is configured with policies and is asynchronous. Use it for multiple geographic regions instead of stretching one cluster across a WAN.

Read more in [[en/posts/2026-11-21-rabbitmq-cluster|Clusters and high availability]].
