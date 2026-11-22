---
title: Pagination
description: "Chia danh sách lớn thành từng trang."
tags: [api, performance]
type: note
region: Vùng API
---

**Phân trang** bằng offset dễ làm nhưng chậm dần với offset lớn và lặp hoặc sót bản ghi khi dữ liệu thay đổi. Phân trang bằng cursor (keyset) lấy "các bản ghi sau bản ghi cuối đã thấy", ổn định và nhanh đều, nhưng không nhảy được tới trang bất kỳ và cần khóa phụ như `id` để thứ tự xác định.

Đọc thêm trong bài [[posts/2026-11-18-api-performance|Hiệu năng API]].
