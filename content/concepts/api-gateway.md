---
title: API Gateway
description: "Cửa vào chung đứng trước nhiều service."
tags: [api, architecture]
type: note
region: Vùng API
---

**API Gateway** làm các việc chung ở rìa: định tuyến, xác thực, giới hạn tốc độ, TLS, log, gộp response từ nhiều service (Backend for Frontend), chuyển đổi giao thức. Nên giữ nó "ngốc", không chứa logic nghiệp vụ, và chạy nhiều bản vì nó là điểm chết của cả hệ thống.

Đọc thêm trong bài [[2026-11-18-api-architecture|Kiến trúc và vận hành API]].
