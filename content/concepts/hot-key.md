---
title: "Hot Key"
description: "Một key nhận quá nhiều lượt đọc tới mức node cache giữ nó quá tải."
tags: ["caching", "redis", "performance"]
type: note
region: Vùng Cache
---

**Hot key** khác stampede: cache vẫn trúng, nhưng một node gánh hết. Thêm node không chia được một key. Vá bằng cache trong RAM từng pod cho key hot, nhân bản key (`product:42#0..7`), hoặc đọc từ replica. Tìm bằng `redis-cli --hotkeys` (cần chính sách LFU).

Đọc thêm trong bài [[posts/2026-11-22-caching-under-load|Cache dưới tải cao]].
