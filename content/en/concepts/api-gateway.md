---
title: API Gateway
description: "A shared front door that sits in front of many services."
tags: [api, architecture]
type: note
region: API Region
lang: en
---

An **API Gateway** does the shared work at the edge: routing, authentication, rate limiting, TLS, logging, aggregating responses from several services (Backend for Frontend), and protocol translation. Keep it "dumb", with no business logic, and run several instances, because it is a single point of failure for the whole system.

Read more in [[en/posts/2026-11-18-api-architecture|API Architecture and Operations]].
