---
title: API Keys
description: "A long-lived secret string that identifies an integrating application."
tags: [api, security]
type: note
region: API Region
lang: en
---

An **API key** identifies an *application*, not a user. Show it only once at creation, store only its hash in the database, give it a recognizable prefix so secret scanners can catch it, attach scopes, and allow revocation. Never embed an API key in code that runs in a browser or a mobile app.

Read more in [[en/posts/2026-11-18-api-security|API Security]].
