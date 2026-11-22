---
title: "Compensation"
description: "An undo operation on the first system when the step on the second system fails."
tags: ["reliability", "flash-sale"]
type: note
region: Database Region
lang: en
---

**Compensation**: Redis has already decremented a unit and the Postgres transaction fails, so a second Lua script adds the unit back and takes back that buyer's quota in the same run. Both go into one script so there is no case where the unit is returned but the quota is forgotten. Compensation is a small version of the saga pattern, and it only runs while the process is still alive to run it.

Read more in [[en/posts/2026-11-22-transactions-flash-sale|A flash sale that never oversells]].
