---
title: Pagination
description: "Splitting a large list into pages."
tags: [api, performance]
type: note
region: API Region
lang: en
---

Offset **pagination** is easy to build but gets slower as the offset grows, and it repeats or skips records when the data changes. Cursor (keyset) pagination fetches "the records after the last one seen"; it is stable and uniformly fast, but it cannot jump to an arbitrary page and needs a tiebreaker such as `id` to make the order deterministic.

Read more in [[en/posts/2026-11-18-api-performance|API Performance]].
