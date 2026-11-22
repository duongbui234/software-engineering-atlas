---
title: "Eviction Policy"
description: "Luật Redis chọn key để đẩy khi đầy: nhóm key nào, theo tiêu chí nào."
tags: ["caching", "redis"]
type: note
region: Vùng Cache
---

**maxmemory-policy** có 10 giá trị ở Redis 8: `noeviction` (mặc định, ghi lỗi OOM), `allkeys-` và `volatile-` kết hợp `lru`, `lfu`, `lrm` (8.6+), `random`, cùng `volatile-ttl`. `volatile-*` hành xử như `noeviction` khi không còn key có TTL. Redis chỉ làm cache thì `allkeys-lfu`/`allkeys-lru`.

Đọc thêm trong bài [[posts/2026-11-22-caching-redis|Redis làm cache]].
