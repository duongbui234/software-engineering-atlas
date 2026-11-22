---
title: CORS
description: "A mechanism that lets a server allow JavaScript from another origin to read a response; enforced by the browser."
tags: [api, security]
type: note
region: API Region
lang: en
---

**CORS** relaxes the Same-Origin Policy: the server returns `Access-Control-Allow-Origin` to let a page on another origin read the response, and for non-simple requests the browser asks first with an `OPTIONS` preflight. CORS protects users in the browser; it does not block `curl`, it does not replace authentication, and it does not prevent CSRF.

Read more in [[en/posts/2026-11-18-api-security|API Security]].
