---
title: API Versioning
description: "How to change an API contract without breaking old clients."
tags: [api, architecture]
type: note
region: API Region
lang: en
---

**Versioning** is only needed for breaking changes; adding an endpoint, a field or an optional parameter is not one. The version can live in the URL (`/api/v1`), in a header, or in a date like Stripe does (the core code only knows the newest version, and the edge translates for old clients). When you retire a version, announce it ahead of time with the `Deprecation` and `Sunset` headers.

Read more in [[en/posts/2026-11-18-api-architecture|API Architecture and Operations]].
