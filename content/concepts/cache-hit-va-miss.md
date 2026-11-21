---
title: "Cache Hit và Miss"
description: "Trúng: dữ liệu có sẵn trong cache. Trượt: phải đi lấy từ nguồn."
tags: ["caching", "performance"]
type: note
region: Vùng Cache
---

**Hit** là lần đọc tìm thấy dữ liệu trong cache và trả ngay. **Miss** là lần không tìm thấy: phải đọc nguồn (database, origin), cộng thêm thời gian đã hỏi cache, rồi thường ghi kết quả vào cache. Vì miss đắt hơn cả không có cache một chút, cache trượt gần hết là cache lỗ.

Đọc thêm trong bài [[2026-11-22-caching-why|Vì sao cần cache]].
