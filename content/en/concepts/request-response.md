---
title: Request-Response
description: "One question, one answer: the client sends a request, the server returns exactly one response and forgets."
tags: [api, http]
type: note
region: API Region
lang: en
---

HTTP follows the **request-response** model: the client speaks first, and the server returns exactly one response per request. The server does not remember earlier requests (stateless), so every request must carry its own context, such as a token, an idempotency key or a correlation id. In NestJS a request passes through middleware → guard → interceptor → pipe → handler, and errors branch off to an exception filter.

Read more in [[en/posts/2026-11-18-api-foundations|API Foundations]].
