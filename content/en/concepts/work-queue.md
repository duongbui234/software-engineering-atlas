---
title: "Work Queue"
description: "Several consumers read from one queue and the broker splits the messages among them."
tags: [rabbitmq, messaging]
type: note
region: Messaging Region
lang: en
---

A **work queue** (competing consumers) is one queue with several identical consumers; each message goes to only one consumer. By default the broker distributes round-robin regardless of who is busy; only manual acks plus a small prefetch distribute by who is free. To process faster, add consumers. This is how load leveling becomes reality.

Read more in [[en/posts/2026-11-21-rabbitmq-ack-confirm|Reliable hand-offs: acks, prefetch, confirms]].
