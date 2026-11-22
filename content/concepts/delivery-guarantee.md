---
title: "Delivery Guarantee"
description: "Socket.IO mặc định giao at most once: tin server gửi lúc client mất kết nối là mất."
tags: ["realtime", "socket-io", "reliability"]
type: note
region: Vùng Realtime
---

**Delivery guarantee** của Socket.IO mặc định là **at most once**: thứ tự được giữ, nhưng tin có thể mất. Client đang mất kết nối thì đệm tin của nó lại để gửi sau; server thì không đệm gì cho client vắng mặt. Muốn at least once phải tự làm: mỗi tin có id, lưu lại, client báo id cuối khi nối lại để server phát bù (xem [[at-least-once-delivery]]).

Đọc thêm trong bài [[2026-11-22-websocket-rooms|Namespace, room và kết nối lại]].
