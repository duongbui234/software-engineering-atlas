---
title: "Binding"
description: "The rule linking an exchange to a queue: copy the message into the queue when its label matches the pattern."
tags: [rabbitmq, messaging]
type: note
region: Messaging Region
lang: en
---

A **binding** says "exchange E copies messages into queue Q when the routing key matches binding key K". A queue can have many bindings and an exchange can bind to many queues; each matching queue then gets its own copy. Adding a listener only takes a new queue and binding. A binding can also link an exchange to another exchange.

Read more in [[en/posts/2026-11-21-rabbitmq-amqp-model|Inside the post office: the AMQP model]].
