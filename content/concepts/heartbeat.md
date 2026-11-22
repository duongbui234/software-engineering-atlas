---
title: "Heartbeat"
description: "Server Engine.IO gửi ping mỗi pingInterval, client phải trả pong trong pingTimeout, không thì coi như chết."
tags: ["realtime", "socket-io"]
type: note
region: Vùng Realtime
---

**Heartbeat** của Engine.IO v4: server gửi gói `2` (ping) mỗi `pingInterval` (mặc định 25 giây), client phải trả `3` (pong) trong `pingTimeout` (mặc định 20 giây). Đây là heartbeat ở tầng ứng dụng, không phải frame ping của RFC 6455, nên chạy được cả trên long polling. Nó cũng giữ cho proxy thấy có dữ liệu và không cắt kết nối im lặng.

Đọc thêm trong bài [[2026-11-22-websocket-socketio|Socket.IO không phải WebSocket]].
