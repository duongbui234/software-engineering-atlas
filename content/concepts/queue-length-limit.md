---
title: "Queue Length Limit"
description: "Giới hạn số tin hoặc số byte của queue, và cách xử lý khi đầy."
tags: [rabbitmq, messaging]
type: note
region: Vùng Messaging
---

`x-max-length` và `x-max-length-bytes` giới hạn tin ready trong queue. Khi đầy, `x-overflow` quyết định: `drop-head` (mặc định, bỏ tin cũ nhất), `reject-publish` (từ chối tin mới, producer nhận nack) hoặc `reject-publish-dlx` (từ chối và dead-letter; không có ở quorum). Đặt giới hạn là cách rẻ nhất để một consumer chết không kéo cả broker vào cảnh báo bộ nhớ.

Đọc thêm trong bài [[posts/2026-11-21-rabbitmq-dlx-retry|Thư lỗi và thư hẹn giờ]].
