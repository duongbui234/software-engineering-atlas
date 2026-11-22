---
title: "Headers Exchange"
description: "Routes by the message headers instead of the routing key."
tags: [rabbitmq, messaging]
type: note
region: Messaging Region
lang: en
---

A **headers exchange** ignores the routing key and compares the message headers with the binding arguments. `x-match: all` requires every key-value pair to match, `any` needs only one; the `all-with-x` and `any-with-x` variants also count headers starting with `x-`. It fits when the filter criteria cannot be arranged into an ordered string, but it is harder to read than topic.

Read more in [[en/posts/2026-11-21-rabbitmq-exchanges|The four standard exchange types]].
