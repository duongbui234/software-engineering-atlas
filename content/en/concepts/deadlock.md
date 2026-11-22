---
title: "Deadlock"
description: "A wait cycle: each transaction holds a lock the next one needs."
tags: ["database", "locking", "postgres"]
type: note
region: Database Region
lang: en
---

A **deadlock** happens when cart X holds the lock on SKU A and waits for B, while cart Y holds B and waits for A. Postgres waits `deadlock_timeout` (1 second by default), detects the wait cycle and aborts one transaction with `40P01`; which side gets aborted is unpredictable. Every deadlock costs at least one second of waiting and one failed request. The prevention is lock ordering, not retries.

Read more in [[en/posts/2026-11-22-transactions-deadlock|Deadlocks and long transactions]].
