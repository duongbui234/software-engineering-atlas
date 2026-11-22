---
title: "Long-running Transaction"
description: "A transaction kept open longer than needed, usually because it does work unrelated to the database inside it."
tags: ["database", "postgres", "reliability"]
type: note
region: Database Region
lang: en
---

A **long-running transaction** (calling a payment gateway, sending an email, waiting on a slow service while a transaction is open) holds row locks, holds a connection from the pool, and holds old row versions that MVCC can't clean up yet. In this line's example, holding the lock on a SKU for 3 seconds makes every buyer of that SKU wait 3 seconds. Call external APIs before or after the transaction, use an outbox, and set `idle_in_transaction_session_timeout`.

Read more in [[en/posts/2026-11-22-transactions-deadlock|Deadlocks and long transactions]].
