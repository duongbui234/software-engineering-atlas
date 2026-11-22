---
title: "Transaction Retry"
description: "Rerun the whole transaction on 40001 or 40P01, with a limit and jitter."
tags: ["database", "reliability"]
type: note
region: Database Region
lang: en
---

**Transaction retry** done right: rerun from the first statement, only for `40001` (serialization failure) and `40P01` (deadlock), which Prisma lumps together as `P2034`; cap the attempts; wait with exponential backoff and jitter; no external side effects inside the block. But retry is only a safety net: with 20 carts locking in opposite orders and up to 5 retries, only 8 carts finish, while sorting the SKUs gets 20/20.

Read more in [[en/posts/2026-11-22-transactions-deadlock|Deadlocks and long transactions]].
