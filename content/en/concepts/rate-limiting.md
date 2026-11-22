---
title: Rate Limiting
description: "Limiting the number of requests in a time window; the excess is rejected with 429."
tags: [api, reliability]
type: note
region: API Region
lang: en
---

**Rate limiting** protects a system from overuse. Common algorithms: fixed window, sliding window, token bucket (allows bursts), leaky bucket. Tell the client with `X-RateLimit-*` and `Retry-After`, and decide in advance whether to fail open or fail closed when the counter store (Redis) dies.

Read more in [[en/posts/2026-11-18-api-reliability|API Reliability]].
