---
title: Caching
description: "Lưu lại một bản sao nhỏ, nhanh của dữ liệu để dùng lại, đổi độ tươi lấy tốc độ."
tags: [caching, api, performance]
type: note
region: Vùng Cache
---

**Cache** là bản sao nhỏ và nhanh của dữ liệu nằm ở chỗ chậm hơn. Nó có ở nhiều tầng: trình duyệt và CDN (điều khiển bằng `Cache-Control`, `ETag`), trong RAM của ứng dụng, Redis dùng chung, và ngay trong cơ sở dữ liệu. Cache hiệu quả nhờ locality: người dùng đọc lặp lại một nhóm nhỏ dữ liệu. Cái giá là dữ liệu có thể cũ; phần khó là invalidation, chống stampede khi key hot hết hạn, và giữ cache an toàn.

Cả [[series/caching|tuyến Caching]] bắt đầu từ bài [[2026-11-22-caching-why|Vì sao cần cache]]. Cache xuất hiện lần đầu ở bài [[2026-11-18-api-performance|Hiệu năng API]].
