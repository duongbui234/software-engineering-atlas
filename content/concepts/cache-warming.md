---
title: "Cache Warming"
description: "Nạp sẵn dữ liệu chắc chắn sẽ được đọc trước khi nhận lưu lượng."
tags: ["caching", "reliability"]
type: note
region: Vùng Cache
---

**Cache warming** tránh để lượt người dùng đầu tiên sau khởi động hay deploy rơi thẳng xuống database: nạp feature flag, quyền, sản phẩm sắp giảm giá trước giờ cao điểm. Giới hạn tốc độ nạp và thêm TTL jitter để không tự gây tải hay hết hạn hàng loạt.

Đọc thêm trong bài [[2026-11-22-caching-distributed|Nhiều tầng, nhiều máy]].
