---
title: "Asynchronous Messaging"
description: "The producer hands the message to the broker and moves on, without waiting for the consumer to finish."
tags: [rabbitmq, messaging]
type: note
region: Messaging Region
lang: en
---

**Asynchronous messaging** means the producer only waits for the broker to confirm "I have the message" (a few milliseconds), not for the consumer to finish the work. User requests get faster because side work is pushed to later, but the total amount of work does not shrink and the result is not available right away. Work whose result the user needs immediately should still be a synchronous call.

Read more in [[en/posts/2026-11-21-rabbitmq-why-queues|Why we need a message queue]].
