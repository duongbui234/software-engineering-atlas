---
title: "LRU và LFU"
description: "LRU đẩy key lâu nhất chưa dùng; LFU đẩy key ít được dùng nhất."
tags: ["caching", "redis", "algorithms"]
type: note
region: Vùng Cache
---

**LRU** bị một lượt quét làm hỏng (key bị quét trông "mới"); **LFU** giữ key hot vì nhìn tần suất. Redis xấp xỉ cả hai bằng lấy mẫu (`maxmemory-samples` 5); LFU dùng bộ đếm logarit 8 bit (Morris counter) và giảm dần theo thời gian (`lfu-log-factor`, `lfu-decay-time`).

Đọc thêm trong bài [[posts/2026-11-22-caching-redis|Redis làm cache]].
