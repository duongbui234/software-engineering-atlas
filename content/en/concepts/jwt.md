---
title: JSON Web Token
description: "A self-contained token made of a header, payload and signature; signed, not encrypted."
tags: [api, security]
type: note
region: API Region
lang: en
---

A **JWT** (RFC 7519) is `header.payload.signature`, base64url-encoded. The signature prevents tampering but not reading: anyone can decode the payload. The server must decide for itself which algorithms it accepts (to defeat `alg: none`), keep access tokens short-lived, and needs an allowlist or blocklist to revoke a token before it expires.

Read more in [[en/posts/2026-11-18-api-security|API Security]].
