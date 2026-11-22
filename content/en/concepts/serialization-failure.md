---
title: "Serialization Failure"
description: "Error 40001: the transaction cannot commit and still be correct, so it must start over."
tags: ["database", "isolation", "reliability"]
type: note
region: Database Region
lang: en
---

A **serialization failure** (SQLSTATE `40001`) is how Repeatable Read and Serializable say "do it again"; it is not a bug. You must `ROLLBACK` and rerun **the whole transaction** to get a new snapshot, with a limit on attempts and a random wait. Prisma reports it, together with deadlocks, as code `P2034`. Without a retry, the error goes straight to the user: 293 out of 300 people in this line's example.

Read more in [[en/posts/2026-11-22-transactions-isolation|Isolation levels in Postgres]].
