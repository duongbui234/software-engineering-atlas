---
title: "Isolation Level"
description: "The level that decides what a transaction sees while other transactions are writing at the same time."
tags: ["database", "isolation"]
type: note
region: Database Region
lang: en
---

The **isolation level** decides which anomalies can happen between concurrent transactions. Postgres has three real levels: Read Committed (the default), Repeatable Read (in practice Snapshot Isolation) and Serializable. The SQL standard's table only talks about dirty reads, non-repeatable reads and phantoms; it doesn't mention lost updates or write skew, the two bugs a flash sale actually runs into.

Read more in [[en/posts/2026-11-22-transactions-isolation|Isolation levels in Postgres]].
