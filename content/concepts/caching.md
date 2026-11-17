---
title: Caching
description: "Lưu lại kết quả để dùng lại, đổi độ tươi lấy tốc độ."
tags: [api, performance]
type: note
region: Vùng API
---

**Cache** có nhiều tầng: trình duyệt và CDN (điều khiển bằng `Cache-Control`, `ETag`), ứng dụng (Redis, mẫu cache-aside), cơ sở dữ liệu. Phần khó là invalidation: dữ liệu cũ bao lâu thì chấp nhận được và ai xóa cache khi dữ liệu đổi. Khi key hot hết hạn, cần khóa ngắn hạn để chống cache stampede.

Đọc thêm trong bài [[2026-11-18-api-performance|Hiệu năng API]].
