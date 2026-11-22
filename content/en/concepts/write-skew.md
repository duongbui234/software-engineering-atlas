---
title: "Write Skew"
description: "Two transactions read the same data and then write to two different rows, together violating a rule that spans several rows."
tags: ["database", "isolation"]
type: note
region: Database Region
lang: en
---

**Write skew**: a user already has 1 order and the limit is 2; two tabs both count and see 1, both `INSERT` a new order, and the user ends up with 3 orders. Nobody overwrote anybody, so Snapshot Isolation (Postgres's Repeatable Read) sees no conflict. Only Serializable, a `UNIQUE` constraint, or a lock on the whole group of data can stop it. The classic example: two doctors both ask for the night off because each sees the other is still on call.

Read more in [[en/posts/2026-11-22-transactions-isolation|Isolation levels in Postgres]].
