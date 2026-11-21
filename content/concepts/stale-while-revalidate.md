---
title: "Stale-While-Revalidate"
description: "Hết hạn vẫn trả bản cũ ngay trong N giây, đồng thời lấy bản mới ở nền."
tags: ["caching", "http"]
type: note
region: Vùng Cache
---

**stale-while-revalidate** (RFC 5861) để không ai phải chờ origin lúc một mục vừa hết hạn; cái giá là có thể thấy bản cũ thêm tối đa N giây. Đi kèm `stale-if-error` để dùng bản cũ khi origin lỗi 500, 502, 503, 504.

Đọc thêm trong bài [[2026-11-22-caching-http|Cache trên đường HTTP]].
