---
title: Retries with Backoff
description: "Thử lại lỗi tạm thời với khoảng chờ tăng dần và ngẫu nhiên."
tags: [api, reliability]
type: note
region: Vùng API
---

**Retry với exponential backoff** chờ 200ms, 400ms, 800ms… giữa các lần thử; **jitter** thêm ngẫu nhiên để các client không retry cùng lúc. Chỉ retry lỗi tạm thời (mạng, `5xx`, timeout), không retry `4xx`, chỉ retry ở một tầng, và chỉ retry thao tác idempotent hoặc có idempotency key.

Đọc thêm trong bài [[posts/2026-11-18-api-reliability|Độ tin cậy của API]].
