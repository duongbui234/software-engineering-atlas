---
title: "Advisory Lock"
description: "A lock on a number the app picks, not tied to any row or table."
tags: ["database", "locking", "postgres"]
type: note
region: Database Region
lang: en
---

An **advisory lock** means only what the app agrees it means. The session-level kind is held until you unlock it or the session closes, even across a rollback, so it can easily get stuck through a connection pool; the transaction-level kind (`pg_advisory_xact_lock`) releases itself when the transaction ends. flash-sale uses `pg_try_advisory_xact_lock(hashtext("…"))` so a cron job runs on only one pod per round, with no separate distributed lock.

Read more in [[en/posts/2026-11-22-transactions-locking|Pessimistic and optimistic locking]].
