---
title: "Concurrency Checklist"
description: "Twelve things to check anywhere many requests write at the same time."
tags: ["database", "concurrency"]
type: note
region: Database Region
lang: en
---

The summary of the Transactions and Locking line: one transaction per multi-step operation; no read-modify-write; know your isolation level; put the condition in the `WHERE` and always check the row count; rules spanning several rows get a `UNIQUE` constraint or Serializable; `CHECK` for invariants; choose your locks on purpose; lock in a fixed order; no external API calls inside a transaction; retry with jitter is only a safety net; filter traffic before the hot row; compensation and reconciliation when there are two sources of data.

Read more in [[en/posts/2026-11-22-transactions-flash-sale|A flash sale that never oversells]].
