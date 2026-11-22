---
title: OAuth 2.0
description: "An authorization protocol: lets an application access data on a user's behalf without their password."
tags: [api, security]
type: note
region: API Region
lang: en
---

**OAuth 2.0** issues a scoped access token to an application after the user consents at the authorization server. The recommended flow today is Authorization Code + PKCE; the implicit and password grants are now advised against (RFC 9700). OAuth is authorization; the login part is OpenID Connect.

Read more in [[en/posts/2026-11-18-api-security|API Security]].
