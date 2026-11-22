---
title: "ACID"
description: "The four promises of a transaction: Atomicity, Consistency, Isolation, Durability."
tags: ["database", "transaction"]
type: note
region: Database Region
lang: en
---

**ACID**: Atomicity (the whole block or nothing), Consistency (the data's rules still hold after every transaction), Isolation (transactions running at the same time don't see each other's half-done state), Durability (once committed, never lost). The C is mostly the writer's responsibility: the database only enforces the rules declared as constraints. The I comes in several levels, and Postgres's default level does not prevent overselling.

Read more in [[en/posts/2026-11-22-transactions-acid|What a transaction is]].
