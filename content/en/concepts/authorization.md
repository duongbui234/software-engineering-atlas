---
title: Authorization
description: "Authorization: what an authenticated caller is allowed to do."
tags: [api, security]
type: note
region: API Region
lang: en
---

**Authorization** runs after authentication; on failure it returns `403`. It needs two layers: by role (does this role have the `order:read` permission?) and by ownership (does this order belong to the caller?). Missing the second layer is BOLA, the top item of the OWASP API Security Top 10.

Read more in [[en/posts/2026-11-18-api-security|API Security]].
