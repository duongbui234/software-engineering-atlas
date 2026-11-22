---
title: HTTPS and TLS
description: "HTTP over TLS: encryption, integrity and server authentication."
tags: [api, security]
type: note
region: API Region
lang: en
---

**HTTPS** is HTTP over TLS; TLS 1.3 (RFC 8446) ensures nobody can eavesdrop, nobody can tamper, and the certificate proves it is the right server. TLS is usually terminated at the ingress or load balancer; send `Strict-Transport-Security` so the browser only uses HTTPS, and set the `Secure` flag on cookies.

Read more in [[en/posts/2026-11-18-api-security|API Security]].
