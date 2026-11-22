---
title: "Multiplexing"
description: "Nhiều namespace đi chung một kết nối Engine.IO, và option của lời gọi io() đầu tiên thắng."
tags: ["realtime", "socket-io"]
type: note
region: Vùng Realtime
---

**Multiplexing**: `io('/flash-sale')` và `io('/notifications')` tới cùng origin dùng chung một Manager, tức một kết nối Engine.IO. Tiết kiệm kết nối, nhưng có bẫy: option tầng vận chuyển như `transports` của lời gọi sau bị bỏ qua, vì Manager đã được tạo theo option của lời gọi đầu. Muốn tách thì dùng `forceNew: true`.

Đọc thêm trong bài [[posts/2026-11-22-websocket-rooms|Namespace, room và kết nối lại]].
