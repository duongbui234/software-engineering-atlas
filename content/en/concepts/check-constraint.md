---
title: "Check Constraint"
description: "A constraint declared on a table that the database checks on every write."
tags: ["database", "postgres"]
type: note
region: Database Region
lang: en
---

A **check constraint** such as `CHECK (stock >= 0)` or `CHECK (sold_count <= allocated_stock)` makes the database reject every write that would produce a violating row (error `23514`), no matter which code sent it. It catches write paths that don't go through the main code (admin scripts, migrations, new code that forgot the condition) and turns a bug into a clear error instead of silently wrong data. It is the last line of defense.

Read more in [[en/posts/2026-11-22-transactions-atomic-update|Decrementing stock with one UPDATE]].
