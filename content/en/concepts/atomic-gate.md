---
title: "Atomic Gate"
description: "A Lua script in Redis that checks and decrements units atomically, stopping most buyers before the database."
tags: ["redis", "flash-sale", "concurrency"]
type: note
region: Database Region
lang: en
---

flash-sale's **atomic gate** is a Lua script: check that the campaign is still running, check the per-buyer limit, `DECRBY` the stock (if it goes negative, add it back and reject), record the quota. Redis runs the whole script before any other command, so there is no read-modify-write gap and no write skew. 3000 people click, and only 100 transactions reach Postgres. The script has no rollback: a command that has run has taken effect.

Read more in [[en/posts/2026-11-22-transactions-flash-sale|A flash sale that never oversells]].
