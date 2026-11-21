---
title: "Browser Cache"
description: "Cache riêng của trình duyệt, chỉ phục vụ một người, điều khiển bằng header HTTP."
tags: ["caching", "http"]
type: note
region: Vùng Cache
---

**Browser cache** là private cache theo RFC 9111: được giữ cả dữ liệu riêng tư vì không ai khác đọc được. Server điều khiển nó bằng `Cache-Control` và hỏi lại bằng `ETag`. Không xóa được từ xa, nên file tĩnh nên có mã băm trong tên.

Đọc thêm trong bài [[2026-11-22-caching-http|Cache trên đường HTTP]].
