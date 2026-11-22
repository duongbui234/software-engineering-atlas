---
title: HTTP Methods
description: "The verbs of HTTP, each with a safe and idempotent guarantee."
tags: [api, http]
type: note
region: API Region
lang: en
---

An **HTTP method** states the intent of a request. RFC 9110 gives each method two properties: *safe* (does not change state: `GET`, `HEAD`, `OPTIONS`) and *idempotent* (calling it N times equals calling it once: add `PUT` and `DELETE`). `POST` has neither, so an order-creating endpoint needs an `Idempotency-Key` to retry safely.

Read more in [[en/posts/2026-11-18-api-foundations|API Foundations]].
