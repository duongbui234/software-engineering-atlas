---
title: "Transaction"
description: "A block of statements that take effect together, or none of them take effect."
tags: ["database", "transaction"]
type: note
region: Database Region
lang: en
---

A **transaction** groups several statements between `BEGIN` and `COMMIT` into one block: if there is an error, a lost connection or a dead pod midway, the whole block is discarded. Without `BEGIN`, each statement commits on its own and a half-done state is the real state. A transaction takes care of "all or nothing", but it does not by itself stop two requests from reading the same stale number; that is the job of isolation and locks.

Read more in [[en/posts/2026-11-22-transactions-acid|What a transaction is]].
