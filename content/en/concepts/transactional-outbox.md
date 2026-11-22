---
title: "Transactional Outbox"
description: "Write the event to an outbox table in the same transaction as the data, then a relay publishes it."
tags: [rabbitmq, messaging]
type: note
region: Messaging Region
lang: en
---

The **transactional outbox** solves [[en/concepts/dual-write|dual write]]: instead of committing to the database and then publishing to the broker (a crash in between loses the event), write the event to an outbox table in the same transaction. A relay periodically reads unsent rows, publishes them with confirms, and marks them sent. The relay can publish duplicates, so an outbox always goes with an idempotent consumer.

Read more in [[en/posts/2026-11-21-rabbitmq-delivery-guarantees|No loss, no duplicates]].
