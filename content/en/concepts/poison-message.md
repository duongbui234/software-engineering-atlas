---
title: "Poison Message"
description: "A message that makes the consumer fail every time; retrying only wastes resources."
tags: [rabbitmq, messaging]
type: note
region: Messaging Region
lang: en
---

A **poison message** carries corrupt data or refers to something that no longer exists. Defend by classifying errors in the consumer (data errors go straight to the parking lot), counting attempts with `x-death`, and using the quorum queue delivery limit. Classic queues have no automatic mechanism for poison messages.

Read more in [[en/posts/2026-11-21-rabbitmq-dlx-retry|Dead letters and scheduled letters]].
