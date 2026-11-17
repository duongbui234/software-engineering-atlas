---
title: API Versioning
description: "Cách thay đổi hợp đồng API mà không làm hỏng client cũ."
tags: [api, architecture]
type: note
region: Vùng API
---

**Versioning** chỉ cần cho thay đổi phá vỡ; thêm endpoint, thêm field, thêm tham số tùy chọn thì không. Version có thể đặt trên URL (`/api/v1`), trong header, hoặc theo ngày như Stripe (code lõi chỉ biết bản mới, rìa chuyển đổi cho client cũ). Ngừng hỗ trợ thì báo trước bằng header `Deprecation` và `Sunset`.

Đọc thêm trong bài [[2026-11-18-api-architecture|Kiến trúc và vận hành API]].
