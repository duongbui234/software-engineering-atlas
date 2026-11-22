---
title: "Hit Ratio"
description: "Tỉ lệ lượt đọc được cache trả lời; quyết định tốc độ và tải còn lại của nguồn."
tags: ["caching", "performance", "observability"]
type: note
region: Vùng Cache
---

**Hit ratio** = số lần trúng / tổng số lần đọc. Nó cũng đo tải mà nguồn phải chịu: từ 95% lên 99% làm tải database giảm 5 lần. Hit ratio phụ thuộc kích thước cache so với working set và mức độ dồn của truy cập; nên đo theo từng loại cache, không chỉ số gộp của Redis.

Đọc thêm trong bài [[posts/2026-11-22-caching-why|Vì sao cần cache]].
