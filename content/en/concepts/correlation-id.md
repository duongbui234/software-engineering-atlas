---
title: "Correlation ID"
description: "An id attached to a request at the entrance, present in every log line of that request and returned to the caller."
tags: [logging, observability, api]
type: note
region: Operations Region
lang: en
---

The first middleware takes the id from a header (for example `X-Correlation-ID`) if an upstream already set one, or generates a new one, then returns it in the response header and the error body. A user who sends a screenshot of the error already holds the key to the logs. An id coming from outside must be checked (length, characters) before it is logged. The id lives in the request context (usually [[en/concepts/async-local-storage|AsyncLocalStorage]]), not in the log by itself: only a logger that reads the context can write it. A correlation id is not the trace id of W3C Trace Context (`traceparent`); logs should carry both so you can jump from a log line to its trace.

Read more in [[en/posts/2026-11-24-flash-sale-logging|The flash-sale logging system]].
