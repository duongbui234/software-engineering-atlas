---
title: "WebSocket Frame"
description: "Đơn vị dữ liệu của WebSocket: vài byte đầu (FIN, opcode, MASK, độ dài) rồi tới payload."
tags: ["realtime", "websocket"]
type: note
region: Vùng Realtime
---

**Frame** là cách WebSocket đóng gói dữ liệu: byte 1 chứa bit FIN (khúc cuối của tin) và opcode (1 text, 2 binary, 8 close, 9 ping, 10 pong), byte 2 chứa bit MASK và độ dài (dưới 126 thì ghi thẳng, 126 thì thêm 2 byte, 127 thì thêm 8 byte). Một tin lớn có thể cắt thành nhiều frame. Overhead chỉ 2–14 byte mỗi frame, so với vài trăm byte header của một request HTTP.

Đọc thêm trong bài [[2026-11-22-websocket-protocol|Bên trong giao thức WebSocket]].
