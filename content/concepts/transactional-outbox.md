---
title: "Transactional Outbox"
description: "Ghi sự kiện vào bảng outbox cùng transaction với dữ liệu, rồi một relay gửi đi."
tags: [rabbitmq, messaging]
type: note
region: Vùng Messaging
---

**Transactional outbox** giải bài [[dual-write|ghi hai nơi]]: thay vì commit database rồi gửi broker (chết giữa chừng là mất sự kiện), ghi sự kiện vào bảng outbox trong cùng transaction. Một relay định kỳ đọc các dòng chưa gửi, gửi với confirm, rồi đánh dấu đã gửi. Relay có thể gửi trùng, nên outbox luôn đi cùng consumer idempotent.

Đọc thêm trong bài [[2026-11-21-rabbitmq-delivery-guarantees|Không mất, không trùng]].
