---
title: "Defense in Depth"
description: "Several independent layers of protection, none assuming the others are correct."
tags: ["reliability", "database"]
type: note
region: Database Region
lang: en
---

**Defense in depth** against overselling in flash-sale: the Lua script in Redis, the conditional UPDATE inside the Postgres transaction, and `CHECK (sold_count <= allocated_stock)`. The last layer lives in the database because that is the only place every write path must pass through. A bug in an upper layer becomes a clear error instead of an order with no stock to ship.

Read more in [[en/posts/2026-11-22-transactions-flash-sale|A flash sale that never oversells]].
