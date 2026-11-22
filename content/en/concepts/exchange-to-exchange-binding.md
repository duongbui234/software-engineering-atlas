---
title: "Exchange-to-Exchange Binding"
description: "Binding one exchange to another exchange instead of to a queue."
tags: [rabbitmq, messaging]
type: note
region: Messaging Region
lang: en
---

**Exchange-to-exchange binding** is a RabbitMQ extension that lets a message pass through a chain of exchanges, each applying its own rules. The broker merges the routes before copying, so each queue gets only one copy even when several paths lead to it, and loops are detected. It fits when each team wants to manage its own exchange under a shared one.

Read more in [[en/posts/2026-11-21-rabbitmq-exchanges|The four standard exchange types]].
