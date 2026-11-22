---
title: "Commit and Rollback"
description: "COMMIT makes the whole block of changes final; ROLLBACK discards the whole block."
tags: ["database", "transaction"]
type: note
region: Database Region
lang: en
---

**COMMIT** makes every change in the transaction visible to other sessions at the same moment. **ROLLBACK** discards them. A rollback happens when the code asks for it, when a statement fails (after which Postgres rejects every following statement until you roll back), or when the connection drops midway. The last case matters most: when a pod dies, no cleanup code can run, but the database still cleans up correctly.

Read more in [[en/posts/2026-11-22-transactions-acid|What a transaction is]].
