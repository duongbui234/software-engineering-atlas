---
title: "Negative Caching"
description: "Cache cả câu trả lời \"không tồn tại\", thường với TTL ngắn hơn."
tags: ["caching", "patterns"]
type: note
region: Vùng Cache
---

**Negative caching** để những câu hỏi lặp lại về thứ không có không đổ xuống database mỗi lần (DNS làm việc này theo RFC 2308). Phải xóa mục "không có" khi thứ đó được tạo; không chống được kẻ quét bằng id mới mỗi lần.

Đọc thêm trong bài [[posts/2026-11-22-caching-invalidation|Invalidation]].
