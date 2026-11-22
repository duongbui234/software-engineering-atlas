---
title: GraphQL
description: "A query language for APIs: the client picks the fields it needs through one endpoint."
tags: [api, architecture]
type: note
region: API Region
lang: en
---

**GraphQL** lets the client send a query describing exactly the shape of data it needs, based on a typed schema the server publishes. It solves over-fetching and under-fetching when there are many kinds of clients; in exchange, HTTP caching is hard to use, resolvers easily hit N+1 (you need DataLoader), and you must limit query depth.

Read more in [[en/posts/2026-11-18-api-styles|Five API Styles]].
