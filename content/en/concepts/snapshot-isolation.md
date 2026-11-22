---
title: "Snapshot Isolation"
description: "The whole transaction reads a single snapshot; whoever writes a row modified after that snapshot gets aborted."
tags: ["database", "isolation", "postgres"]
type: note
region: Database Region
lang: en
---

**Snapshot Isolation** is what Postgres implements for the Repeatable Read level: the snapshot is taken at the first statement and used for the whole transaction. Trying to update or lock a row that changed after the snapshot aborts the transaction with `40001 could not serialize access due to concurrent update`. It prevents lost updates and phantoms, but not write skew, because it only detects conflicts on the same row.

Read more in [[en/posts/2026-11-22-transactions-isolation|Isolation levels in Postgres]].
