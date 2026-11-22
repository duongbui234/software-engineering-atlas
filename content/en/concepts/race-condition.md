---
title: "Race Condition"
description: "The result depends on the random order in which concurrent operations interleave."
tags: ["concurrency", "database"]
type: note
region: Database Region
lang: en
---

A **race condition** exists when at least one interleaving of concurrent requests gives a wrong result. It doesn't show up in sequential tests, every run produces a different number, and it usually only appears at peak load. A flash sale is the ideal setting for it: thousands of requests for the same product in the same second.

Read more in [[en/posts/2026-11-22-transactions-race|Race conditions: reproducing overselling]].
