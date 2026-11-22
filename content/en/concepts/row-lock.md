---
title: "Row Lock"
description: "The lock an UPDATE or SELECT FOR UPDATE places on a row, held until the transaction ends."
tags: ["database", "locking", "postgres"]
type: note
region: Database Region
lang: en
---

Every `UPDATE` takes a **row lock** on its own (`FOR NO KEY UPDATE`, or `FOR UPDATE` if it changes a key column) and holds it until COMMIT or ROLLBACK, not until the statement finishes. A row lock doesn't block readers, only those who want to update, delete or lock the same row. The consequence: everything that runs after the `UPDATE` inside the transaction stretches the time others have to wait.

Read more in [[en/posts/2026-11-22-transactions-atomic-update|Decrementing stock with one UPDATE]].
