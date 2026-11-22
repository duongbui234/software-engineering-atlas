---
title: "Room"
description: "Nhóm socket chỉ server biết, dùng để gửi một tin cho mọi socket trong nhóm."
tags: ["realtime", "socket-io"]
type: note
region: Vùng Realtime
---

**Room** là một nhóm socket do server quản lý: `socket.join('campaign:c-21h')`, rồi `to('campaign:c-21h').emit(…)` gửi cho mọi người trong nhóm. Client không biết mình ở phòng nào. Mỗi socket tự ở trong phòng mang id của nó; phòng `user:<id>` gom mọi tab của một người. Muốn room chạy qua nhiều pod thì cần adapter.

Đọc thêm trong bài [[posts/2026-11-22-websocket-rooms|Namespace, room và kết nối lại]].
