---
title: "Masking"
description: "Every frame the client sends must be XORed with 4 random bytes, so old proxies can't be tricked into cache poisoning."
tags: ["realtime", "websocket", "security"]
type: note
region: Realtime Region
lang: en
---

**Masking**: the client must mask the payload with a random 4-byte masking key (XORing each byte), and the server must not mask. This is not encryption (the masking key is right in the frame); the purpose is to stop an attacker from choosing in advance the bytes on the wire and tricking an intermediary proxy into misreading them as an HTTP request and poisoning its cache (RFC 6455, section 10.3).

Read more in [[en/posts/2026-11-22-websocket-protocol|Inside the WebSocket protocol]].
