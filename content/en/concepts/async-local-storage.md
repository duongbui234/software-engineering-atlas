---
title: "AsyncLocalStorage"
description: "A Node.js API that attaches a store to every async task spawned from one call, so deep code can read the request context."
tags: [nodejs, logging]
type: note
region: Operations Region
lang: en
---

`als.run(store, fn)` runs `fn` and attaches `store` to every `await`, `setTimeout` and Promise callback spawned from it; anywhere in that chain `als.getStore()` returns that store. Two requests interleaved on one thread each still see their own store. The context follows where a task was **created**: a timer created at startup runs forever with an empty store, even while it handles data a request pushed into a queue. To keep the context across a queue, store it with the data. Measured cost on Node 24: about 0.15 µs per request.

Read more in [[en/posts/2026-11-24-flash-sale-logging|The flash-sale logging system]].
