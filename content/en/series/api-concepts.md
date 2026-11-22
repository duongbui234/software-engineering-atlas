---
title: The API Concepts Line
description: 33 API concepts a software engineer needs when building APIs, grouped into 6 stations; each station builds on the one before.
series: api
code: API
region: API Region
draft: false
lang: en
stations:
  - name: Foundations
    concepts: [Endpoint, Request-Response, HTTP Methods, Headers, JSON, Status Codes, Error Handling]
  - name: API Styles
    concepts: [REST, GraphQL, gRPC, WebSockets, Webhooks]
  - name: Security
    concepts: [Authentication, Authorization, API Keys, OAuth 2.0, JSON Web Token, HTTPS and TLS, CORS]
  - name: Reliability
    concepts: [Idempotency, Timeouts, Retries with Backoff, Circuit Breaker, Rate Limiting, Throttling]
  - name: Performance
    concepts: [Caching, Pagination, Filtering and Sorting, Load Balancing]
  - name: Architecture and Operations
    concepts: [API Gateway, API Versioning, OpenAPI, Microservices]
---

## If you are just starting

Every example on this line comes from **flash-sale**, a time-limited discount shop I wrote myself: the moment the sale opens, thousands of people race for a few hundred units. You don't need to read the project's code. Each station opens with a **"Picture it first"** section that compares the concepts to something from everyday life (ordering at a restaurant, getting in and out of an office building, ordering a cake by phone…), with a diagram. Each station also has a **quick glossary** for the new terms. Read those two parts before the technical part and it gets much easier to follow.

## Why this order

You can't understand idempotency without knowing which HTTP methods are idempotent by nature, and you can't discuss rate limits without knowing how a request gets authenticated. Each station reuses the vocabulary of the one before, so I learned and wrote them in exactly that order: the foundations of a request, the API styles, security, then the things that keep an API running well (reliability, performance) and how to organize many APIs within one system.

## Where the list comes from

The list of 33 concepts follows the series *API Concepts Every Software Engineer Should Know* from The System Design Newsletter (Neo Kim), [part 1](https://newsletter.systemdesign.one/p/api-concepts-every-software-engineer-should-know) and [part 2](https://newsletter.systemdesign.one/p/api-concepts-for-software-engineers). The way the stations are split, the explanations, the examples and the diagrams here are my own, written from public documentation (MDN, RFCs, the Stripe and GitHub API docs) and from code I ran myself.
