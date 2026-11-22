---
title: Rate Limiting
description: "Giới hạn số request trong một khoảng thời gian, phần vượt bị từ chối với 429."
tags: [api, reliability]
type: note
region: Vùng API
---

**Rate limiting** bảo vệ hệ thống khỏi bị dùng quá mức. Các thuật toán phổ biến: fixed window, sliding window, token bucket (cho phép burst), leaky bucket. Nên báo cho client bằng `X-RateLimit-*` và `Retry-After`, và quyết định trước khi kho đếm (Redis) chết thì mở hay đóng.

Đọc thêm trong bài [[posts/2026-11-18-api-reliability|Độ tin cậy của API]].
