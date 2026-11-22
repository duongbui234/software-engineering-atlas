---
title: Status Codes
description: "A three-digit number that sums up the result of a request."
tags: [api, http]
type: note
region: API Region
lang: en
---

**Status codes** fall into five classes: `2xx` success, `3xx` redirection, `4xx` client error, `5xx` server error. Tell `401` (I don't know who you are) from `403` (I know, but you're not allowed), and `400` (malformed) from `422` (fails business rules); `4xx` should almost never be retried, `5xx` may be.

Read more in [[en/posts/2026-11-18-api-foundations|API Foundations]].
