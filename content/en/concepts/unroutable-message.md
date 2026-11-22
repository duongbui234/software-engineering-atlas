---
title: "Unroutable Message"
description: "A message that matches no binding: by default it is dropped silently."
tags: [rabbitmq, messaging]
type: note
region: Messaging Region
lang: en
---

An **unroutable** message has three possible fates: dropped silently (the default), returned to the producer through `basic.return` with code 312 if published with `mandatory: true`, or sent to an alternate exchange. Publisher confirms still report success for a dropped message, because the broker has fulfilled its responsibility. Watch the `messages_unroutable_dropped` counter to catch it.

Read more in [[en/posts/2026-11-21-rabbitmq-exchanges|The four standard exchange types]].
