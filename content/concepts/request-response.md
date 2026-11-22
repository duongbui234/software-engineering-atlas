---
title: Request-Response
description: "Mô hình một hỏi, một đáp: client gửi request, server trả đúng một response rồi quên."
tags: [api, http]
type: note
region: Vùng API
---

HTTP theo mô hình **request-response**: client mở lời, server trả đúng một response cho mỗi request. Server không nhớ request trước (stateless), nên mỗi request phải tự mang đủ ngữ cảnh như token, idempotency key, correlation id. Trong NestJS, request đi qua middleware → guard → interceptor → pipe → handler, lỗi rẽ sang exception filter.

Đọc thêm trong bài [[posts/2026-11-18-api-foundations|Nền tảng API]].
