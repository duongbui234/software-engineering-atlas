---
title: "Optimistic Locking"
description: "Don't lock when reading; when writing, check that the version hasn't changed, and retry if it has."
tags: ["database", "locking"]
type: note
region: Database Region
lang: en
---

**Optimistic locking** adds a `version` column and writes with `UPDATE … WHERE id = $1 AND version = <the one read>`, incrementing the version on every write. 0 matched rows means someone wrote first. flash-sale uses it for order status, carts and vouchers. It fits when conflicts are rare or the read-to-write gap is long (a user editing a form); on a hot row, most of the effort is work done and then thrown away.

Read more in [[en/posts/2026-11-22-transactions-locking|Pessimistic and optimistic locking]].
