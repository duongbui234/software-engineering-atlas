---
title: "Full-duplex"
description: "Hai bên gửi dữ liệu cùng lúc trên cùng một kết nối, không phải chờ lượt."
tags: ["realtime", "networking"]
type: note
region: Vùng Realtime
---

**Full-duplex** (song công toàn phần): như gọi điện thoại, hai bên nói cùng lúc được. HTTP/1.1 thì một bên hỏi, một bên đáp, theo lượt. WebSocket mở một kết nối full-duplex: client gửi lệnh và server đẩy tin trên cùng một đường, độc lập với nhau.

Đọc thêm trong bài [[2026-11-22-websocket-realtime-options|Bốn cách để server báo tin]].
