---
title: "Write-Behind"
description: "Chỉ ghi cache rồi trả lời ngay; database được ghi sau, theo lô."
tags: ["caching", "patterns"]
type: note
region: Vùng Cache
---

**Write-behind** (write-back) ghi rất nhanh và gộp nhiều lần ghi cùng key thành một. Nhưng trước khi flush, cache là nguồn sự thật duy nhất: sập là mất dữ liệu, lỗi ràng buộc DB xảy ra sau khi đã báo thành công. Chỉ dùng cho dữ liệu chịu được mất một ít (bộ đếm, thống kê).

Đọc thêm trong bài [[posts/2026-11-22-caching-patterns|Mẫu đọc và ghi]].
