---
title: "Stream"
description: "A replicated append-only log; reading does not delete messages."
tags: [rabbitmq, messaging]
type: note
region: Messaging Region
lang: en
---

A **stream** (since 3.9) keeps messages according to retention (`x-max-age`, `x-max-length-bytes`), allows any number of consumers to read, and supports rereading by offset. Over AMQP 0-9-1 you must set a prefetch and use manual acks. No per-message TTL, DLX, priority or delivery limit. The stream protocol (port 5552) adds super streams, filtering, server-side offset tracking and single active consumer.

Read more in [[en/posts/2026-11-21-rabbitmq-queue-types|Classic, quorum or stream]].
