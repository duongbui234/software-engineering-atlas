---
title: "Lost Update"
description: "Two transactions read the same value and both write; the later write overwrites the earlier one."
tags: ["concurrency", "database"]
type: note
region: Database Region
lang: en
---

A **lost update** (phenomenon P4): two transactions both read 37, both write 36, and stock drops by only 1 even though 2 were sold. Postgres's Read Committed doesn't prevent it, because the later request applies the operation "set stock = 36" (a constant the app computed from old data) to the newest version. In this line's example: 300 orders for 100 units, and the final stock is still 86. `stock = stock - 1` cures the lost update but not the overselling.

Read more in [[en/posts/2026-11-22-transactions-race|Race conditions: reproducing overselling]].
