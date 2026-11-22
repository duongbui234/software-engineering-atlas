---
title: "Write-Around"
description: "Ghi thẳng database, không đụng cache; cache chỉ được nạp khi có người đọc."
tags: ["caching", "patterns"]
type: note
region: Vùng Cache
---

**Write-around** không làm bẩn cache bằng dữ liệu ghi một lần ít đọc lại. Bẫy: mục đã có trong cache sẽ trả giá trị cũ tới hết TTL, nên thực tế thường kèm bước xóa, tức đường ghi của cache-aside.

Đọc thêm trong bài [[posts/2026-11-22-caching-patterns|Mẫu đọc và ghi]].
