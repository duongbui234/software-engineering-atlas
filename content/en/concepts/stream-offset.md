---
title: "Stream Offset"
description: "Where reading starts in a stream: first, last, next, a number or a timestamp."
tags: [rabbitmq, messaging]
type: note
region: Messaging Region
lang: en
---

`x-stream-offset` accepts `first` (the oldest remaining message), `last` (the last written **chunk**, possibly several messages), `next` (only new messages), a numeric offset, or a timestamp or time interval. Offsets start at 0. Since 4.4, `x-stream-initial-offset` sets the stream's default starting point.

Read more in [[en/posts/2026-11-21-rabbitmq-queue-types|Classic, quorum or stream]].
