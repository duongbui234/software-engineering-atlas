---
title: API Keys
description: "Chuỗi bí mật dài hạn định danh một ứng dụng tích hợp."
tags: [api, security]
type: note
region: Vùng API
---

**API key** định danh *ứng dụng* chứ không phải người dùng. Chỉ hiển thị một lần lúc tạo, DB chỉ lưu hash, có tiền tố dễ nhận diện để công cụ quét secret bắt được, gắn scope và cho phép thu hồi. Không bao giờ nhúng API key vào code chạy ở trình duyệt hay app mobile.

Đọc thêm trong bài [[2026-11-18-api-security|Bảo mật API]].
