---
title: "Lock Timeout"
description: "A limit on how long to wait for a lock; past it, the statement is canceled with 55P03."
tags: ["database", "postgres", "reliability"]
type: note
region: Database Region
lang: en
---

`lock_timeout` cancels a statement when a single lock wait exceeds the set time, with error `55P03`. The default is 0 (wait forever), as with `statement_timeout` and `idle_in_transaction_session_timeout`. Set it with `SET LOCAL lock_timeout = "500ms"` on the hot path so a request fails fast and says "busy, try again" instead of dragging the whole connection pool into hanging with it.

Read more in [[en/posts/2026-11-22-transactions-deadlock|Deadlocks and long transactions]].
