---
title: "Cache Checklist"
description: "Danh sách kiểm tra trước khi đưa một cache lên production, gom cả tuyến Caching."
tags: ["caching", "operations"]
type: note
region: Vùng Cache
---

**Cache checklist**: có nên cache không, khóa đủ và chuẩn hóa, `Cache-Control` rõ ràng, mẫu ghi đúng, mọi mục có TTL và xóa đủ, chống stampede và penetration, `maxmemory` và chính sách, L1 có TTL, đo theo từng cache, fail-open có tính tải database, không có unkeyed input.

Đọc thêm trong bài [[2026-11-22-caching-operations|Vận hành và an toàn]].
