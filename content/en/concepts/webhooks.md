---
title: Webhooks
description: "An external system calls back into you over HTTP when an event happens."
tags: [api, integration]
type: note
region: API Region
lang: en
---

A **webhook** is an API in reverse: you register a URL, and the other side sends a request when an event happens (payment gateways call it IPN). The rules: verify the signature, process idempotently because the sender will resend, return `2xx` fast, push heavy work into a queue, and never trust a return URL that passes through the browser.

Read more in [[en/posts/2026-11-18-api-styles|Five API Styles]].

Why webhooks differ from polling, long polling, SSE and WebSocket (server calls server; a browser cannot receive them) is covered in [[en/posts/2026-11-22-websocket-realtime-options|Four ways for a server to push news]].
