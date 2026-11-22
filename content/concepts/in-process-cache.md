---
title: "In-process Cache"
description: "Cache nằm trong RAM của chính tiến trình ứng dụng, không qua mạng."
tags: ["caching", "performance"]
type: note
region: Vùng Cache
---

**In-process cache** nhanh hơn Redis hàng trăm lần nhưng mỗi pod giữ một bản riêng, không tự đồng bộ, và trống khi pod khởi động. Một `Map` không giới hạn là rò rỉ bộ nhớ; dùng LRU có `max` và TTL. Hợp với dữ liệu nhỏ, đọc cực nhiều, ít đổi.

Đọc thêm trong bài [[posts/2026-11-22-caching-distributed|Nhiều tầng, nhiều máy]].
