---
title: Idempotency
description: "Whether an operation runs once or N times, the end result is the same."
tags: [api, reliability]
type: note
region: API Region
lang: en
---

An **idempotent** operation leaves the same final state whether it runs once or many times. In HTTP, `GET`, `PUT` and `DELETE` are idempotent by nature; `POST` is not, so payment APIs add an `Idempotency-Key` header to retry safely. The server claims the key with an atomic operation *before* doing anything with side effects, stores the response, and returns that response when it sees the key again; the same key with a different body is rejected.

Read more in [[en/posts/2026-11-18-api-reliability|API Reliability]].
