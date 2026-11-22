---
title: "Hot Row"
description: "A row that a great many transactions want to write at the same moment."
tags: ["database", "locking", "flash-sale"]
type: note
region: Database Region
lang: en
---

A **hot row** (a flash-sale product's stock, a store-wide voucher counter) caps throughput at roughly 1 divided by the lock hold time, because only one transaction can write at a time. Every locking strategy is bound by that limit. There are only two ways out: hold the lock for less time, or filter requests out before they reach that row (like flash-sale's Redis gate).

Read more in [[en/posts/2026-11-22-transactions-locking|Pessimistic and optimistic locking]].
