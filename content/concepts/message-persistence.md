---
title: "Message Persistence"
description: "Ba điều kiện để tin sống qua lần broker khởi động lại."
tags: [rabbitmq, messaging]
type: note
region: Vùng Messaging
---

Tin chỉ sống qua lần khởi động lại khi có đủ: queue durable (hoặc quorum/stream), tin persistent (`delivery_mode = 2`), và publisher confirm để biết tin đã thật sự được ghi, vì broker không `fsync` từng tin ngay. Thiếu một là có khe hở. Cả ba chỉ bảo vệ tin trên một node; muốn chịu được node hỏng thì cần quorum queue.

Đọc thêm trong bài [[2026-11-21-rabbitmq-ack-confirm|Giao nhận chắc tay: ack, prefetch, confirm]].
