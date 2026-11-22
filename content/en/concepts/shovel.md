---
title: "Shovel"
description: "A one-way pump that moves messages from a source to a destination."
tags: [rabbitmq, messaging]
type: note
region: Messaging Region
lang: en
---

A **shovel** reads from a source queue or exchange and publishes to a destination, with acks and confirms on both ends; it speaks AMQP 0-9-1 and 1.0 and can run between clusters. Dynamic shovels declared at runtime are the modern approach; since 4.2 there is a local shovel within the same cluster. Common uses: moving messages when changing queue type, during blue-green upgrades, or draining a dead-letter queue.

Read more in [[en/posts/2026-11-21-rabbitmq-cluster|Clusters and high availability]].
