---
title: "Cache-Control"
description: "Header HTTP ghi luật cache cho mọi cache trên đường đi: thời hạn, ai được lưu, có phải hỏi lại không."
tags: ["caching", "http"]
type: note
region: Vùng Cache
---

**Cache-Control** có các chỉ thị chính: `max-age`, `s-maxage`, `public`, `private`, `no-cache` (lưu được nhưng phải hỏi lại), `no-store` (cấm lưu), `must-revalidate`, `immutable`, `stale-while-revalidate`, `stale-if-error`. Không ghi luật thì cache được phép tự đoán thời hạn từ `Last-Modified`.

Đọc thêm trong bài [[posts/2026-11-22-caching-http|Cache trên đường HTTP]].
