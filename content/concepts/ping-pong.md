---
title: "Ping/Pong"
description: "Frame điều khiển để hỏi \"còn sống không\": nhận ping thì phải trả pong cùng nội dung."
tags: ["realtime", "websocket"]
type: note
region: Vùng Realtime
---

**Ping/Pong** là hai frame điều khiển (opcode 9 và 10) của RFC 6455: bên nhận ping phải trả pong với cùng payload. Dùng để phát hiện kết nối chết lặng lẽ và giữ cho proxy không cắt kết nối im lặng. API WebSocket của trình duyệt không cho tự gửi ping, chỉ tự trả pong, nên muốn heartbeat từ phía client thì phải tự làm ở tầng ứng dụng.

Đọc thêm trong bài [[2026-11-22-websocket-protocol|Bên trong giao thức WebSocket]].
