---
title: "Sticky Session"
description: "Load balancer luôn đưa một client về cùng một server, bắt buộc khi Socket.IO dùng long polling."
tags: ["realtime", "socket-io", "scaling"]
type: note
region: Vùng Realtime
---

**Sticky session**: load balancer gắn một client với một backend (theo cookie hoặc theo IP). Socket.IO cần nó khi có long polling, vì mỗi lần poll là một request HTTP riêng và chỉ pod đã cấp `sid` mới biết phiên đó; tới nhầm pod là `400 Session ID unknown`. Chỉ dùng WebSocket (`transports: ["websocket"]`) thì không cần, vì cả phiên là một kết nối TCP.

Đọc thêm trong bài [[2026-11-22-websocket-scaling|Chạy trên nhiều pod]].
