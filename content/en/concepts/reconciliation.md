---
title: "Reconciliation"
description: "Compare two data sources against a chosen source of truth and fix the discrepancy."
tags: ["reliability", "flash-sale"]
type: note
region: Database Region
lang: en
---

**Reconciliation** catches the discrepancies compensation can't, such as a pod dying between Redis decrementing and Postgres committing. flash-sale reconciles when the campaign ends: stop the workers, count the **real, non-canceled orders** in Postgres, fix the counters, and return unsold units to regular stock. It happens at the end because by then no request is sitting between the two systems.

Read more in [[en/posts/2026-11-22-transactions-flash-sale|A flash sale that never oversells]].
