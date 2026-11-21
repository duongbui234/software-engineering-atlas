---
title: "Cache Invalidation"
description: "Làm cho mục cache cũ không còn được dùng khi nguồn đổi."
tags: ["caching", "consistency"]
type: note
region: Vùng Cache
---

**Cache invalidation** có ba cách: chỉ dựa TTL, xóa trong code ghi sau khi commit, hoặc theo sự kiện (CDC đọc commit log như mcsqueal của Facebook, Debezium). Khó nhất là xóa đủ mọi key bị ảnh hưởng, kể cả theo chuỗi phụ thuộc như quyền kế thừa.

Đọc thêm trong bài [[2026-11-22-caching-invalidation|Invalidation]].
