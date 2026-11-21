---
title: "Cache Key"
description: "Khóa để tìm một mục trong cache; phải chứa mọi thứ làm kết quả khác đi, và chỉ những thứ đó."
tags: ["caching", "design"]
type: note
region: Vùng Cache
---

**Cache key** thiếu thông tin thì trả nhầm (trang 2 nhận trang 1, người này thấy dữ liệu người kia); thừa thông tin (timestamp, request id) thì không bao giờ trúng. Nên chuẩn hóa (sắp xếp tham số, băm) để cùng nghĩa thì cùng key, và đặt tên theo quy ước `<loại>:<id>`.

Đọc thêm trong bài [[2026-11-22-caching-why|Vì sao cần cache]].
