---
title: "Read Committed"
description: "Postgres's default level: each statement sees the data committed as of the moment that statement began."
tags: ["database", "isolation", "postgres"]
type: note
region: Database Region
lang: en
---

At **Read Committed**, each statement takes a new snapshot, so two `SELECT` statements in the same transaction can see two different numbers. When an `UPDATE` meets a row that is being modified, it waits and then re-runs the `WHERE` on the newest version. That behavior causes lost updates for read-modify-write code, but it also makes a conditional UPDATE correct without any retry. Prisma uses this level too unless you specify one.

Read more in [[en/posts/2026-11-22-transactions-isolation|Isolation levels in Postgres]].
