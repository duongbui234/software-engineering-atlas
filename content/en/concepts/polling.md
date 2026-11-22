---
title: "Polling"
description: "The client asks the server on a fixed cycle, and most answers are \"nothing yet\"."
tags: ["realtime", "http"]
type: note
region: Realtime Region
lang: en
---

**Polling** (asking periodically): the client sends a request every N seconds. Easy to build and it passes through every proxy, but news always arrives N/2 seconds late on average and most requests are useless. In the post's example, asking every 2 seconds gives an average latency of about 1 second and still misses the last event.

Read more in [[en/posts/2026-11-22-websocket-realtime-options|Four ways for the server to send news]].
