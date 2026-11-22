---
title: "Stream"
description: "Log chỉ ghi nối, có bản sao, đọc không xóa tin."
tags: [rabbitmq, messaging]
type: note
region: Vùng Messaging
---

**Stream** (từ 3.9) giữ tin theo retention (`x-max-age`, `x-max-length-bytes`), cho bao nhiêu consumer cùng đọc cũng được, và đọc lại theo offset. Qua AMQP 0-9-1 phải đặt prefetch và ack thủ công. Không có TTL theo tin, DLX, priority hay delivery limit. Stream protocol (cổng 5552) có thêm super stream, lọc, theo dõi offset phía server và single active consumer.

Đọc thêm trong bài [[posts/2026-11-21-rabbitmq-queue-types|Classic, quorum hay stream]].
