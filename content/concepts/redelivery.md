---
title: "Redelivery"
description: "Tin unacked quay lại hàng và được giao lại với cờ `redelivered = true`."
tags: [rabbitmq, messaging]
type: note
region: Vùng Messaging
---

**Redelivery** xảy ra khi consumer chết, mất kết nối, hoặc `nack`/`reject` có requeue. Tin giao lại mang `redelivered = true`. `false` thì chắc chắn tin chưa từng được giao; `true` chỉ nghĩa là *có thể* đã xử lý. Cờ này không đủ để chống trùng, vì bản gửi lại của producer vẫn có `redelivered = false`.

Đọc thêm trong bài [[2026-11-21-rabbitmq-ack-confirm|Giao nhận chắc tay: ack, prefetch, confirm]].
