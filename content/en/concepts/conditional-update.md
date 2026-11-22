---
title: "Conditional Update"
description: "Check the condition and write in the same UPDATE statement, then count the affected rows."
tags: ["database", "concurrency"]
type: note
region: Database Region
lang: en
---

A **conditional update**: `UPDATE … SET stock = stock - 1 WHERE id = $1 AND stock >= 1`. The condition and the operation are stuck together, the new value is computed inside the database, and 0 matched rows means sold out. This is how flash-sale reserves stock, confirms a sale and redeems a voucher. It only protects a rule on the row being modified; a rule spanning several rows needs something else.

Read more in [[en/posts/2026-11-22-transactions-atomic-update|Decrementing stock with one UPDATE]].
