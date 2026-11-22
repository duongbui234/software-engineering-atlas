---
title: "Re-check After Lock"
description: "At Read Committed, an UPDATE that had to wait for a lock re-runs its WHERE on the newest row version."
tags: ["database", "postgres", "isolation"]
type: note
region: Database Region
lang: en
---

When an `UPDATE` at Read Committed meets a row that is being modified, it waits; if the other side commits, Postgres takes the newest version and **re-evaluates the `WHERE` condition** (called EvalPlanQual in the source code). If it still matches, the operation is applied to the new version; if not, the row is skipped. Thanks to this, when 1 unit is left and two people decrement it at once, the second one gets 0 rows instead of decrementing to -1. At Repeatable Read, the same situation is a `40001` error instead.

Read more in [[en/posts/2026-11-22-transactions-atomic-update|Decrementing stock with one UPDATE]].
