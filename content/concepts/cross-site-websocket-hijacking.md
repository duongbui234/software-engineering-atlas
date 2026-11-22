---
title: "Cross-Site WebSocket Hijacking"
description: "Trang lạ mở WebSocket tới server của bạn, trình duyệt tự gửi cookie; WebSocket không bị CORS chặn."
tags: ["realtime", "security"]
type: note
region: Vùng Realtime
---

**Cross-Site WebSocket Hijacking** (CSWSH): WebSocket không chịu Same-Origin Policy hay CORS, nên trang `evil.example` mở được kết nối tới server của bạn và trình duyệt tự đính kèm cookie (nếu SameSite cho phép). Server xác thực bằng cookie mà không kiểm `Origin` là kẻ tấn công đọc và gửi tin thay người dùng. Chặn bằng kiểm `Origin` ở handshake hoặc xác thực bằng token gửi tường minh.

Đọc thêm trong bài [[2026-11-22-websocket-security|An toàn và vận hành]].
