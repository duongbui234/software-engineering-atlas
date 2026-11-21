---
title: "Cache Penetration"
description: "Request hỏi key không tồn tại nên cache không bao giờ trúng và mọi request đều xuống database."
tags: ["caching", "reliability", "security"]
type: note
region: Vùng Cache
---

**Cache penetration** có thể do link hỏng hoặc bot quét id để đánh thẳng vào database. Vá bằng negative cache (chặn câu hỏi lặp lại) và Bloom filter (chặn ngay cả id chưa từng hỏi), kèm rate limit.

Đọc thêm trong bài [[2026-11-22-caching-under-load|Cache dưới tải cao]].
