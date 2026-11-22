---
title: "Topic Exchange"
description: "Matches routing keys made of dot-separated words; `*` is exactly one word, `#` is zero or more words."
tags: [rabbitmq, messaging]
type: note
region: Messaging Region
lang: en
---

A **topic exchange** compares a routing key like `order.vn.hcm.placed` with binding keys containing wildcards: `*` matches exactly one word, `#` matches zero, one or more words. So `order.vn.#` also matches `order.vn`, while `*.cancelled` does not match `order.vn.cancelled`. A binding of just `#` turns it into a fanout. Since 4.4, a binding key may contain at most two `#`.

Read more in [[en/posts/2026-11-21-rabbitmq-exchanges|The four standard exchange types]].
