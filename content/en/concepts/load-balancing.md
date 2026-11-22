---
title: Load Balancing
description: "Spreading requests across many replicas of a service."
tags: [api, performance]
type: note
region: API Region
lang: en
---

**Load balancing** lets you run many pods behind one address. It only works smoothly when pods are stateless, a health check pulls broken pods out, and pods get a grace period when shutting down. Round robin is enough when requests are uniform; when they vary in weight, least connections or EWMA spreads the load more evenly.

Read more in [[en/posts/2026-11-18-api-performance|API Performance]].
