---
title: Error Handling
description: "Errors are part of the API contract and need a fixed format, just like successful responses."
tags: [api, http]
type: note
region: API Region
lang: en
---

Good **error handling** means: catch every exception in one place, never leak a stack trace, log every 500 in full with a correlation id, and return a fixed format with stable error codes. RFC 9457 (Problem Details) standardizes that format as `application/problem+json`. In flash-sale I found a filter that dropped `code`, so the frontend only showed axios's default message.

Read more in [[en/posts/2026-11-18-api-foundations|API Foundations]].
