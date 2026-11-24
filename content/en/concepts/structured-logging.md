---
title: "Structured Logging"
description: "Each log line is an object with fixed fields, so the log store can filter and compute on it."
tags: [logging, observability]
type: note
region: Operations Region
lang: en
---

Instead of a sentence like `Order 42 failed after 12ms`, each log line is an object (usually printed as single-line JSON): `{"level":"error","orderId":42,"durationMs":12}`. The log store understands every field, so filtering `statusCode >= 500` or computing p95 per `url` is a query. JSON is only the format; structured means the same fact always lives in the same field with the same type. Writing `"12ms"` (a string) rules out percentiles, and sorting by characters puts `"100ms"` before `"20ms"`. Put the unit in the field name: `durationMs`.

Read more in [[en/posts/2026-11-24-flash-sale-logging|The flash-sale logging system]].
