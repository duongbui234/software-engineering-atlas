---
title: "Pessimistic Locking"
description: "Lock the row before reading with SELECT FOR UPDATE; whoever comes later queues up and waits."
tags: ["database", "locking"]
type: note
region: Database Region
lang: en
---

**Pessimistic locking** assumes a conflict will happen: `SELECT … FOR UPDATE` locks the row right at read time, other requests wait and (at Read Committed) get the newest version once released. Correct, no retries, a good fit for high contention. The price is that the lock is held all the way from the read to COMMIT; don't call external APIs or wait for the user during that span.

Read more in [[en/posts/2026-11-22-transactions-locking|Pessimistic and optimistic locking]].
