---
title: "Decoupling"
description: "Bên gửi không cần biết ai nhận, bao nhiêu bên nhận, bên nhận sống hay chết."
tags: [rabbitmq, messaging]
type: note
region: Vùng Messaging
---

**Tách rời** qua broker theo ba chiều: không gian (không cần biết địa chỉ bên nhận), thời gian (bên nhận không cần sống đúng lúc gửi) và tốc độ (bên nhận xử lý theo nhịp của mình). Thêm một bên nghe chỉ cần thêm queue và binding, không sửa producer. Ràng buộc không mất hẳn mà chuyển sang hợp đồng tin nhắn: tên sự kiện và cấu trúc dữ liệu.

Đọc thêm trong bài [[2026-11-21-rabbitmq-why-queues|Vì sao cần hàng đợi tin nhắn]].
