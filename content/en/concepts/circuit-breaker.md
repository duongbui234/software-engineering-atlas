---
title: Circuit Breaker
description: "A breaker for remote calls: after too many errors, stop calling for a while, then try again."
tags: [api, reliability]
type: note
region: API Region
lang: en
---

A **circuit breaker** has three states: CLOSED (call normally, count errors), OPEN (fail immediately, don't call), HALF_OPEN (let one request through as a probe). It gives the dependency time to recover and lets my requests fail fast instead of waiting for a timeout. Flash-sale nests retry inside the breaker: `CB(Retry(action))`.

Read more in [[en/posts/2026-11-18-api-reliability|API Reliability]].
