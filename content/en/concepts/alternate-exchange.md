---
title: "Alternate Exchange"
description: "A fallback exchange that receives messages matching no binding."
tags: [rabbitmq, messaging]
type: note
region: Messaging Region
lang: en
---

An **alternate exchange** (AE) is attached to an exchange; a message that matches no binding goes to the AE instead of being dropped. The AE is usually a fanout bound to a "lost mail" queue you can inspect later. Set it with a policy if you can; the `alternate-exchange` argument works too. A message sent to the AE counts as routed, so `mandatory` does not trigger a `basic.return`.

Read more in [[en/posts/2026-11-21-rabbitmq-exchanges|The four standard exchange types]].
