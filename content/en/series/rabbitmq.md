---
title: The RabbitMQ Line
description: "All of RabbitMQ for beginners, from \"why we need a queue\" to running a cluster in production, in 9 stations; each station builds on the previous one."
series: rabbitmq
code: MQ
region: Messaging Region
draft: false
lang: en
stations:
  - name: Why we need a queue
    concepts: [Message Broker, Asynchronous Messaging, Decoupling, Load Leveling, Producer and Consumer, Queue and Log]
  - name: The AMQP model
    concepts: [AMQP, Connection, Channel, Virtual Host, Exchange, Queue, Binding, Routing Key, Message Properties]
  - name: Exchange types
    concepts: [Default Exchange, Direct Exchange, Fanout Exchange, Topic Exchange, Headers Exchange, Exchange-to-Exchange Binding, Alternate Exchange, Unroutable Message]
  - name: Ack, prefetch, confirm
    concepts: [Work Queue, Consumer Acknowledgement, Auto-ack, Prefetch, Redelivery, Publisher Confirms, Message Persistence]
  - name: No loss, no duplicates
    concepts: [At-least-once Delivery, Exactly-once Delivery, Idempotent Consumer, Transactional Outbox, Message Ordering, Request-Reply]
  - name: Dead letters and delayed messages
    concepts: [Dead Letter Exchange, Message TTL, Queue Length Limit, Delayed Retry, Poison Message, Delayed Message, Priority Queue]
  - name: Classic, quorum, stream
    concepts: [Classic Queue, Quorum Queue, Raft, Delivery Limit, Stream, Stream Offset, Single Active Consumer]
  - name: Clustering and high availability
    concepts: [Clustering, Khepri, Network Partition, Federation, Shovel, Feature Flags]
  - name: Running in production
    concepts: [Resource Alarm, Flow Control, Queue Metrics, Access Control, Policy, Protocols Beyond AMQP 0-9-1, Production Checklist]
---

## If you are just starting

You don't need to know what RabbitMQ is to ride this line. Station 1 starts from the simplest question: why would a system need a "post office" standing between its services, instead of letting them call each other directly? The whole line shares one picture: **RabbitMQ is a post office**. The sender of a letter, the sorting desk, the mailboxes, the mail carrier, the receipt, the dead-letter box… each station opens up one more corner of that post office.

Every station opens with **"Picture it first"** (the concepts compared to everyday life, with a diagram) and a **quick glossary** for the new terms. Read those two parts first, then move on to the technical part.

## Why this order

- **Stations 1–3** build the vocabulary: why we need a broker, the parts of the AMQP model (connection, channel, exchange, queue, binding), and how an exchange decides where a message goes.
- **Stations 4–6** are about "reliable hand-offs": acks and prefetch on the consumer side, confirms on the producer side, why there is only "at least once" and never "exactly once", and what to do with dead letters, messages that need a retry, and delayed messages.
- **Stations 7–9** go into the infrastructure: the three queue types and how they survive a node dying, multi-node clusters, then real operations (monitoring, resource limits, security, a checklist).

You can't understand dead-lettering before you know acks and requeue; you can't pick a quorum queue before you know why messages can be lost. Each station uses only the vocabulary of the stations before it.

## Versions and sources

The line is written for **RabbitMQ 4.4** (the latest release at the time of writing, November 2026), with notes where behavior differs in older versions. Many tutorials online are out of date: mirrored queues were removed in 4.0, non-exclusive queues with `durable: false` are rejected since 4.3, and the delayed message plugin is no longer maintained. Every example on this line really runs on RabbitMQ 4.4.1 with the `amqplib` library, with a Docker command so you can run it yourself.

The main sources are the official documentation at [rabbitmq.com/docs](https://www.rabbitmq.com/docs), the RabbitMQ release notes and the `amqplib` documentation. The examples are inspired by **flash-sale**, a time-limited flash-sale shop I wrote myself, trimmed and renamed.
