---
title: "Message TTL"
description: "How long a message lives, set per queue or per message."
tags: [rabbitmq, messaging]
type: note
region: Messaging Region
lang: en
---

**TTL** is set with `x-message-ttl` for the whole queue or the `expiration` property (a string of milliseconds) for a single message; with both, the smaller value wins. An expired message is only removed or dead-lettered when it reaches the head of the queue, so a short-lived message can get stuck behind a long-lived one. `x-expires` is the TTL of the queue itself: an unused queue gets deleted.

Read more in [[en/posts/2026-11-21-rabbitmq-dlx-retry|Dead letters and scheduled letters]].
