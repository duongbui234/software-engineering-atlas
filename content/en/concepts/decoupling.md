---
title: "Decoupling"
description: "The producer does not need to know who consumes, how many consumers there are, or whether they are up."
tags: [rabbitmq, messaging]
type: note
region: Messaging Region
lang: en
---

**Decoupling** through a broker works along three axes: space (no need to know the consumer's address), time (the consumer need not be running when the message is sent) and rate (the consumer works at its own pace). Adding a listener only takes a new queue and binding, with no change to the producer. The coupling does not disappear; it moves into the message contract: the event name and the data structure.

Read more in [[en/posts/2026-11-21-rabbitmq-why-queues|Why we need a message queue]].
