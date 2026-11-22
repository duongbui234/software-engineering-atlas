---
title: "Locality"
description: "Truy cập không rải đều: thứ vừa dùng sẽ sớm được dùng lại, thứ nằm cạnh cũng vậy."
tags: ["caching", "performance"]
type: note
region: Vùng Cache
---

**Locality** (tính cục bộ) có hai dạng: temporal (vừa đọc sẽ sớm đọc lại) và spatial (đọc một chỗ thì sắp đọc chỗ bên cạnh). Nhờ nó, cache giữ 1% catalog vẫn trúng 39% lượt xem trong ví dụ; truy cập đều thì cache 10% chỉ trúng 10%.

Đọc thêm trong bài [[posts/2026-11-22-caching-why|Vì sao cần cache]].
