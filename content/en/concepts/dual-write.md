---
title: Dual Write
description: "One operation must update two storage systems with no shared transaction."
tags: [flash-sale, database]
type: note
region: Flash Sale Region
lang: en
---

A **dual write** happens when one operation has to modify two systems, for example decrementing stock in Redis and then creating the order in Postgres. No transaction spans both, so a process dying midway leaves the two out of sync, and the compensation block in `catch` never gets to run. Ways to handle it: drop one of the two altogether (Shopify dropped Redis for stock reservation), leave a marker to clean up later, or reconcile against the more trustworthy source. Reconciling against a temporary counter turns the bug into official data.

Read more in [[en/posts/2026-11-21-shopify-flash-sale|How Shopify handles flash sales]].
