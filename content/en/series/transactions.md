---
title: The Transactions and Locking Line
description: "Why wrapping code in a transaction still oversells, and how Postgres actually keeps 3000 people fighting over 100 units from buying a phantom unit, across 7 stations from ACID to isolation, conditional UPDATE, locks, deadlocks and the flash-sale architecture."
series: transactions
code: TX
region: Database Region
draft: false
lang: en
stations:
  - name: What a transaction is
    concepts: [Transaction, ACID, Commit and Rollback, Write-Ahead Log, MVCC]
  - name: Race conditions and overselling
    concepts: [Race Condition, Read-Modify-Write, Lost Update, Oversell]
  - name: Isolation levels
    concepts: [Isolation Level, Read Committed, Snapshot Isolation, Write Skew, Serializable, Serialization Failure]
  - name: Decrementing stock with one UPDATE
    concepts: [Conditional Update, Row Lock, Re-check After Lock, Check Constraint]
  - name: Pessimistic and optimistic locking
    concepts: [Pessimistic Locking, Optimistic Locking, SKIP LOCKED, Advisory Lock, Hot Row]
  - name: Deadlocks and long transactions
    concepts: [Deadlock, Lock Ordering, Lock Timeout, Long-running Transaction, Transaction Retry]
  - name: A flash sale that never oversells
    concepts: [Atomic Gate, Compensation, Reconciliation, Defense in Depth, Concurrency Checklist]
---

## If you are just starting

You don't need to know Postgres or advanced SQL to ride this line. Station 1 starts from the simplest question: placing an order is three statements (reserve stock, create the order, write the stock ledger), so what happens if the machine dies after the second one?

The whole line shares one picture: **a ticket counter with one shared ledger**. Each ticket clerk is a request. A transaction is a **transaction slip**: you draft every step on the slip and only stamp it into the ledger once everything is done; if something breaks halfway, you tear the slip up. Isolation is about **how each clerk sees the ledger** while others are writing in it. A lock is **putting your hand on one line of the ledger** so others have to wait.

The question running through it all: two clerks both see "1 ticket left", both sell it, and both cross out the number. Station 2 lets you watch that happen with your own eyes on a real Postgres: **300 people, 100 units, 300 orders**, even though everything already sits inside a transaction.

Each station opens with **"Picture it first"** (the concept compared to everyday life, with a diagram) and a **quick glossary** for new terms. Read those two parts first, then move on to the technical part.

## Why this order

- **Stations 1–2** are the foundation: a transaction gives you "all or nothing", but it does **not** by itself stop two requests from cutting in on each other. Station 2 reproduces the overselling bug so the later stations have a real problem to solve.
- **Stations 3–4** are two ways to fix it: raise the isolation level (Postgres detects the conflict and aborts, and the app has to retry), or rewrite the operation as **a single conditional UPDATE** so no gap is left. flash-sale picks the second.
- **Stations 5–6** are about locks: when to lock up front (pessimistic), when to check at write time (optimistic), how to avoid waiting (`NOWAIT`, `SKIP LOCKED`), and the price of locks: deadlocks, long transactions, retries.
- **Station 7** puts the flash-sale architecture together: Redis blocks traffic up front so Postgres doesn't have to take 3000 people at once, Postgres holds the truth, and compensation and reconciliation step in when the two disagree.

You can't understand why `UPDATE … WHERE stock >= 1` is correct until you know that Read Committed re-reads the row after waiting for the lock; you can't understand why SKUs need sorting until you know that every `UPDATE` holds its row lock until commit. Each station only uses vocabulary from the stations before it.

This line reuses a few words from [[en/series/caching|the Caching line]] (Redis, hot key), [[en/series/rabbitmq|the RabbitMQ line]] (transactional outbox, idempotent consumer) and the station [[en/posts/2026-11-18-api-reliability|API reliability]] (idempotency, retry with jitter). The station [[en/posts/2026-11-21-shopify-flash-sale|How Shopify handles flash sales]] is a different approach to the same problem.

## Versions and sources

The examples run for real on **PostgreSQL 16**, **Redis 7**, **Node.js 24** and the `pg` 8 library, with the commands to spin up the database yourself with Docker and rerun them. The timings and retry counts shift a little on every run; the order counts, stock levels and error codes do not.

Main sources: the official PostgreSQL 16 documentation (Transaction Isolation, Explicit Locking, the locking clause of `SELECT`, WAL, the `deadlock_timeout` and `lock_timeout` settings), the Prisma transaction docs, the paper *A Critique of ANSI SQL Isolation Levels* (Berenson et al., 1995) and Martin Kleppmann's **Hermitage** test suite. The context examples come from **flash-sale**, a golden-hour discount shop I wrote myself, trimmed and renamed.
