---
title: "Message Size Limit"
description: "A cap on the size of one message: Socket.IO defaults to 1 MB, ws to 100 MiB."
tags: ["realtime", "security"]
type: note
region: Realtime Region
lang: en
---

**Message size limit**: the receiver must buffer a whole message before processing it, so having no limit invites someone to send a message of a few hundred MB to drain your RAM. Socket.IO defaults `maxHttpBufferSize` to 1 MB (exceed it and the connection is cut), the `ws` library defaults `maxPayload` to 100 MiB, so if you use `ws` directly you should lower it.

Read more in [[en/posts/2026-11-22-websocket-security|Security and operations]].
