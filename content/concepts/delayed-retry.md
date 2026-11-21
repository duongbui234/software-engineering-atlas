---
title: "Delayed Retry"
description: "Thử lại sau một khoảng chờ thay vì requeue ngay lập tức."
tags: [rabbitmq, messaging]
type: note
region: Vùng Messaging
---

Kiểu cổ điển: queue chính có DLX trỏ tới một queue chờ có TTL và không có consumer; hết hạn thì tin dead-letter về exchange chính. Đếm số lần thử bằng `x-death`, đủ N lần thì chuyển sang bãi đỗ. Mỗi mức độ trễ cần một queue chờ riêng. Từ RabbitMQ 4.3, quorum queue có sẵn `x-delayed-retry-type`, `-min`, `-max`.

Đọc thêm trong bài [[2026-11-21-rabbitmq-dlx-retry|Thư lỗi và thư hẹn giờ]].
