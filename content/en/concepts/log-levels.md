---
title: "Log Levels"
description: "The severity of each log line, and the threshold that decides which lines get written."
tags: [logging, observability]
type: note
region: Operations Region
lang: en
---

Each log line carries a level. Winston uses the npm table: `error` 0, `warn` 1, `info` 2, `http` 3, `verbose` 4, `debug` 5, `silly` 6; syslog (RFC 5424) has its own 8 levels. A logger has a threshold: a line whose number is above the threshold is dropped before it is formatted or written. Winston defaults to `info`. Caller errors (4xx) fit `warn`, server errors (5xx) fit `error`. The threshold must be changeable at runtime (an environment variable, a flag), because the day of an incident is the day you need `debug`, while at peak hours logs cost money by volume.

Read more in [[en/posts/2026-11-24-flash-sale-logging|The flash-sale logging system]].
