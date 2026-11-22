---
title: "Pub/Sub Invalidation"
description: "Phát tin \"bỏ mục X\" qua kênh Pub/Sub để mọi pod xóa cache cục bộ."
tags: ["caching", "messaging", "consistency"]
type: note
region: Vùng Cache
---

**Pub/Sub invalidation** qua Redis là at-most-once: tin không được lưu, pod đang mất kết nối sẽ lỡ. Gia cố bằng TTL cho L1, xóa sạch L1 khi nối lại, so version định kỳ, hoặc kênh bền (Streams, queue).

Đọc thêm trong bài [[posts/2026-11-22-caching-distributed|Nhiều tầng, nhiều máy]].
