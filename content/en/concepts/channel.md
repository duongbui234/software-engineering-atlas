---
title: "Channel"
description: "A lightweight logical lane sharing one connection; every operation happens on a channel."
tags: [rabbitmq, messaging]
type: note
region: Messaging Region
lang: en
---

A **channel** is a "lightweight connection" inside a connection. Publishing, declaring a queue and acking all happen on a specific channel. Use one channel per thread, never shared. Soft errors (404, 406) close only the channel, not the connection. Delivery tags are numbered per channel, so an ack must go out on the same channel that received the message.

Read more in [[en/posts/2026-11-21-rabbitmq-amqp-model|Inside the post office: the AMQP model]].
