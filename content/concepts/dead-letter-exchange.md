---
title: "Dead Letter Exchange"
description: "Exchange nhận các tin \"chết\": bị từ chối, hết hạn, bị đẩy ra hoặc vượt số lần giao."
tags: [rabbitmq, messaging]
type: note
region: Vùng Messaging
---

Tin bị **dead-letter** khi bị `reject`/`nack` không requeue, hết TTL, bị đẩy ra vì queue đầy, hoặc vượt delivery limit. DLX là exchange bình thường được chỉ định qua policy hoặc `x-dead-letter-exchange`. Header `x-death` ghi queue, lý do và số lần chết. DLX không có queue nào bind thì tin chết mất im lặng.

Đọc thêm trong bài [[posts/2026-11-21-rabbitmq-dlx-retry|Thư lỗi và thư hẹn giờ]].
