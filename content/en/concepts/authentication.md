---
title: Authentication
description: "Authentication: proving who the caller is."
tags: [api, security]
type: note
region: API Region
lang: en
---

**Authentication** trades a piece of evidence (password, OTP, token) for an identity; on failure it returns `401`. Flash-sale always runs bcrypt, even when the email does not exist, so response time leaks nothing, and it limits failed logins by both email and IP.

Read more in [[en/posts/2026-11-18-api-security|API Security]].
