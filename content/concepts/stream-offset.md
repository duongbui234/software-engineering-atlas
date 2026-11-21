---
title: "Stream Offset"
description: "Vị trí bắt đầu đọc trong stream: first, last, next, số thứ tự hoặc thời điểm."
tags: [rabbitmq, messaging]
type: note
region: Vùng Messaging
---

`x-stream-offset` nhận `first` (tin cũ nhất còn lại), `last` (**chunk** ghi cuối, có thể nhiều tin), `next` (chỉ tin mới), một số offset, hoặc một thời điểm hay khoảng thời gian. Offset bắt đầu từ 0. Từ 4.4 có `x-stream-initial-offset` đặt điểm đọc mặc định cho stream.

Đọc thêm trong bài [[2026-11-21-rabbitmq-queue-types|Classic, quorum hay stream]].
