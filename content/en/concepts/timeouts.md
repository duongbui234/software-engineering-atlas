---
title: Timeouts
description: "A deadline for every outgoing call."
tags: [api, reliability]
type: note
region: API Region
lang: en
---

A **timeout** stops a slow dependency from holding resources forever and dragging the whole system down with it. Set it around a high percentile of measured latency, differently for each dependency, and shrinking from the outer layers to the inner ones, so an outer layer does not give up while an inner layer is still working.

Read more in [[en/posts/2026-11-18-api-reliability|API Reliability]].
