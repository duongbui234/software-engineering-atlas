---
title: "Default Exchange"
description: "Direct exchange không tên mà mọi queue tự bind với khóa bằng tên queue."
tags: [rabbitmq, messaging]
type: note
region: Vùng Messaging
---

**Default exchange** có tên rỗng `""`. Mọi queue tự động được bind vào nó với binding key bằng chính tên queue, và không ai bind hay gỡ thủ công được. Vì vậy `sendToQueue(q, ...)` thật ra là `publish("", q, ...)`. Tiện cho ví dụ nhỏ, nhưng producer phải biết tên queue, tức biết người nhận. Default exchange không hỗ trợ alternate exchange.

Đọc thêm trong bài [[posts/2026-11-21-rabbitmq-exchanges|Bốn kiểu exchange chuẩn]].
