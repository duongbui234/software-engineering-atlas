---
title: "Connection"
description: "A long-lived, authenticated TCP connection from an application to the broker."
tags: [rabbitmq, messaging]
type: note
region: Messaging Region
lang: en
---

A **connection** is a TCP connection (optionally with TLS) from an application to RabbitMQ. Opening one is expensive and each connection uses RAM and a file handle on the broker, so open it once when the application starts and keep it. More than about 100 new connections per second is a sign of broken connection management. Heartbeats (5–20 seconds recommended) detect dead connections early.

Read more in [[en/posts/2026-11-21-rabbitmq-amqp-model|Inside the post office: the AMQP model]].
