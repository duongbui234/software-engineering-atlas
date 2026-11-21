---
title: "Cache Poisoning"
description: "Lợi dụng input không nằm trong khóa cache để cache lưu một response độc và phát cho mọi người."
tags: ["caching", "security", "http"]
type: note
region: Vùng Cache
---

**Web cache poisoning** (James Kettle, 2018): origin dùng một header như `X-Forwarded-Host` để dựng trang, cache chỉ khóa theo URL, kẻ tấn công kích hoạt một bản độc dưới khóa chung. Chặn: mọi input ảnh hưởng response phải nằm trong khóa hoặc bị xóa trước origin.

Đọc thêm trong bài [[2026-11-22-caching-operations|Vận hành và an toàn]].
