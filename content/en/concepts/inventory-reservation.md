---
title: Inventory Reservation
description: "Temporarily hold a unit while the customer pays, and only remove it from the stock ledger once payment succeeds."
tags: [flash-sale, database]
type: note
region: Flash Sale Region
lang: en
---

**Inventory reservation** stops overselling the real stock: when a customer starts checking out, the system holds one unit for a few minutes; if payment succeeds, it is removed from the stock ledger for good (a claim), and if the customer abandons, the unit is released. The hardest part is keeping the reserve and the claim on the same source of truth. Shopify moved this from Redis to MySQL, with one row per unit, using `SELECT … FOR UPDATE SKIP LOCKED` so many people can reserve at once without waiting for each other. A canceled unit must go back to exactly the stock it was taken from.

Read more in [[en/posts/2026-11-21-shopify-flash-sale|How Shopify handles flash sales]].
