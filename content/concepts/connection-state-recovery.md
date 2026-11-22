---
title: "Connection State Recovery"
description: "Socket.IO 4.6+ giữ id, room và tin bị lỡ của client mất kết nối ngắn để trả lại khi nối lại."
tags: ["realtime", "socket-io", "reliability"]
type: note
region: Vùng Realtime
---

**Connection state recovery**: bật `connectionStateRecovery`, server giữ trạng thái của socket vừa rớt trong `maxDisconnectionDuration` (ví dụ 2 phút); client nối lại thì được giữ id, room, `socket.data` và nhận các tin đã lỡ, `socket.recovered === true`. Không phải lúc nào cũng thành công, và không chạy với Redis adapter dạng Pub/Sub (cần Redis Streams adapter hoặc MongoDB adapter).

Đọc thêm trong bài [[2026-11-22-websocket-rooms|Namespace, room và kết nối lại]].
