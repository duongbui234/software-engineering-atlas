---
title: Retries with Backoff
description: "Retrying transient errors with growing, randomized waits."
tags: [api, reliability]
type: note
region: API Region
lang: en
---

**Retry with exponential backoff** waits 200ms, 400ms, 800ms… between attempts; **jitter** adds randomness so clients don't retry at the same moment. Retry only transient errors (network, `5xx`, timeout), never `4xx`, retry at only one layer, and retry only idempotent operations or ones with an idempotency key.

Read more in [[en/posts/2026-11-18-api-reliability|API Reliability]].
