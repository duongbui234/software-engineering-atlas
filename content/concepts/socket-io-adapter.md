---
title: "Socket.IO Adapter"
description: "Lớp chuyển tin phát theo room giữa các server Socket.IO, ví dụ Redis adapter dùng Pub/Sub."
tags: ["realtime", "socket-io", "scaling", "redis"]
type: note
region: Vùng Realtime
---

**Adapter** là phần của Socket.IO quyết định một lần `to(room).emit()` tới được những socket nào. Adapter mặc định chỉ biết socket trong RAM của pod hiện tại. Redis adapter publish mỗi lần phát lên Redis Pub/Sub để mọi pod cùng gửi cho socket của mình; mỗi pod cần hai kết nối Redis riêng (pub và sub). Sticky session lo đường vào, adapter lo phát tin ra.

Đọc thêm trong bài [[posts/2026-11-22-websocket-scaling|Chạy trên nhiều pod]].
