---
title: gRPC
description: "Remote procedure calls over HTTP/2 with a Protocol Buffers contract."
tags: [api, architecture]
type: note
region: API Region
lang: en
---

**gRPC** uses a `.proto` file as the contract, generates client and server code for each language, sends binary data over HTTP/2, and supports bidirectional streaming and deadlines. It fits internal calls between services; a browser cannot call it directly without going through gRPC-Web.

Read more in [[en/posts/2026-11-18-api-styles|Five API Styles]].
