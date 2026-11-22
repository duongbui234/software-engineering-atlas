---
title: "Cache Stampede"
description: "Key hot hết hạn, mọi request trong lúc nạp lại đều trượt và cùng đi hỏi nguồn."
tags: ["caching", "reliability", "performance"]
type: note
region: Vùng Cache
---

**Cache stampede** (dogpile, thundering herd): ở 5.000 request/giây và 100 ms nạp lại là khoảng 500 query trùng. Nguồn chậm đi làm cửa sổ dài ra, thành vòng xoáy. Chữa bằng gom request, làm mới sớm theo xác suất, lease.

Đọc thêm trong bài [[posts/2026-11-22-caching-under-load|Cache dưới tải cao]].
