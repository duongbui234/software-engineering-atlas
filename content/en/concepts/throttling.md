---
title: Throttling
description: "Slowing down or queueing the excess instead of rejecting it."
tags: [api, reliability]
type: note
region: API Region
lang: en
---

**Throttling** keeps load steady by spreading requests out over time: queueing, batching, degrading quality. It differs from rate limiting in that users still get served, just later. Flash-sale's virtual queue, which lets 50 people into checkout every 5 seconds, is an example.

Read more in [[en/posts/2026-11-18-api-reliability|API Reliability]].
