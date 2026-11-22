---
title: "Oversell"
description: "More valid orders than the stock that actually exists."
tags: ["concurrency", "flash-sale"]
type: note
region: Database Region
lang: en
---

**Overselling** is what customers and accountants see. It comes from a lost update (stock doesn't drop enough) or from check-then-act (stock drops correctly but goes below 0): 149 orders for 100 units, stock at -49. Two different causes; fixing one does not fix the other. The surest way to stop it is a conditional UPDATE plus a `CHECK` constraint.

Read more in [[en/posts/2026-11-22-transactions-race|Race conditions: reproducing overselling]].
