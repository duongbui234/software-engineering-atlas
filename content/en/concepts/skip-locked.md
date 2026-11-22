---
title: "SKIP LOCKED"
description: "NOWAIT raises an error as soon as it meets a locked row; SKIP LOCKED skips that row and takes another."
tags: ["database", "locking", "postgres"]
type: note
region: Database Region
lang: en
---

`FOR UPDATE NOWAIT` raises error `55P03` instead of waiting. `FOR UPDATE SKIP LOCKED` skips rows that are currently locked, letting several workers take jobs from a queue-like table without waiting for each other. The Postgres docs point out that it gives an inconsistent view, so don't use it for counting or totals. flash-sale uses it for the cron job that cancels expired orders, running on every pod.

Read more in [[en/posts/2026-11-22-transactions-locking|Pessimistic and optimistic locking]].
