---
title: "Subprotocol"
description: "Client đề xuất danh sách giao thức tầng trên trong Sec-WebSocket-Protocol, server chọn một."
tags: ["realtime", "websocket"]
type: note
region: Vùng Realtime
---

**Subprotocol**: WebSocket chỉ chở byte, hai bên phải tự thống nhất nội dung. Client gửi `Sec-WebSocket-Protocol: stock.v1, stock.v2`, server chọn đúng một cái trong số đó và trả lại; trả cái không được đề xuất thì trình duyệt hủy kết nối. Hợp để đánh phiên bản định dạng tin, ví dụ STOMP, MQTT hay `graphql-transport-ws`.

Đọc thêm trong bài [[2026-11-22-websocket-protocol|Bên trong giao thức WebSocket]].
