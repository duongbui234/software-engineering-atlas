---
title: "MVCC"
description: "UPDATE creates a new row version instead of modifying in place, so readers don't have to wait for writers."
tags: ["database", "postgres"]
type: note
region: Database Region
lang: en
---

**MVCC** (multi-version concurrency control): every `UPDATE` creates a new row version and marks the old one as expired from that transaction on (system columns `xmin`, `xmax`, `ctid`). Each session reads the version it is allowed to see, so nobody sees uncommitted data and readers don't wait for writers. The cost: old versions stay around until `VACUUM` cleans them up, and a long-open transaction keeps them alive.

Read more in [[en/posts/2026-11-22-transactions-acid|What a transaction is]].
