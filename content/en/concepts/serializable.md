---
title: "Serializable"
description: "The highest level: the result is as if the transactions had run one after another in some order."
tags: ["database", "isolation", "postgres"]
type: note
region: Database Region
lang: en
---

**Serializable** in Postgres is implemented with Serializable Snapshot Isolation (SSI): Snapshot Isolation plus a record of who read what and who wrote what. When it detects a dependency cycle, it aborts one side with `40001`. SSI's locks don't block anyone, so they don't cause deadlocks; Serializable does not "lock the whole table". The price is that the app must retry, and on a hot row the number of retries is huge.

Read more in [[en/posts/2026-11-22-transactions-isolation|Isolation levels in Postgres]].
