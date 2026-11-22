---
title: "Write-Ahead Log"
description: "A log of changes written to disk before COMMIT replies, so a commit is never lost."
tags: ["database", "postgres"]
type: note
region: Database Region
lang: en
---

The **Write-Ahead Log (WAL)** is an append-only log of every change. On COMMIT, Postgres only needs to fsync the log (a fast, sequential write) before replying; the actual table pages are written gradually at checkpoints. If the machine crashes, Postgres replays the WAL from the latest checkpoint. With `synchronous_commit = on` (the default), COMMIT only replies after the WAL is on disk. The WAL is also what gets shipped to replicas.

Read more in [[en/posts/2026-11-22-transactions-acid|What a transaction is]].
