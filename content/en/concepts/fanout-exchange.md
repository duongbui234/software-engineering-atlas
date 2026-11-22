---
title: "Fanout Exchange"
description: "Copies a message into every bound queue, ignoring the routing key."
tags: [rabbitmq, messaging]
type: note
region: Messaging Region
lang: en
---

A **fanout exchange** is a loudspeaker: every queue bound to it receives every message, and the routing key is ignored. This is the basic pub/sub pattern, usually with one queue per subscriber. Simple and fast, but it cannot filter; when listeners only need some of the events, switch to topic. The built-in `amq.fanout` is available.

Read more in [[en/posts/2026-11-21-rabbitmq-exchanges|The four standard exchange types]].
