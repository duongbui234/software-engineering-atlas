---
title: Microservices
description: "An architecture that splits a system into many small services, each owning its own data."
tags: [api, architecture]
type: note
region: API Region
lang: en
---

**Microservices** let each team deploy and scale its part independently; in exchange, JOINs become network calls, transactions become sagas, and you add latency, network failures and operational complexity. Start with a modular monolith (MonolithFirst) and split gradually, strangler fig style, once the boundaries are clear.

Read more in [[en/posts/2026-11-18-api-architecture|API Architecture and Operations]].
