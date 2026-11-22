---
title: Headers
description: "Name: value metadata that travels with requests and responses."
tags: [api, http]
type: note
region: API Region
lang: en
---

**Headers** carry the request's context: format (`Content-Type`), authentication (`Authorization`), business semantics (`Idempotency-Key`), tracing (`X-Correlation-ID`), security (`Strict-Transport-Security`) and rate limiting (`Retry-After`). Header names are case-insensitive; new custom headers should not use the `X-` prefix (RFC 6648).

Read more in [[en/posts/2026-11-18-api-foundations|API Foundations]].
