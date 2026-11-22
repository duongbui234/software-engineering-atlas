---
title: Filtering and Sorting
description: "Filtering and sorting results by client parameters."
tags: [api, performance]
type: note
region: API Region
lang: en
---

**Filtering and sorting** through the query string needs explicit type conversion (the query string is always a string, and `Boolean("false")` is `true`), a whitelist of sortable fields, an ever-present tiebreaker key, input limits, and a matching index. A parameter you accept must be used; accepting it and ignoring it makes the client think it is filtering.

Read more in [[en/posts/2026-11-18-api-performance|API Performance]].
