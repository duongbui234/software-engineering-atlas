---
title: "Oversell"
description: "Số đơn hợp lệ nhiều hơn số hàng thật có."
tags: ["concurrency", "flash-sale"]
type: note
region: Vùng Database
---

**Oversell** (bán quá số hàng) là thứ khách hàng và kế toán nhìn thấy. Nó đến từ lost update (kho không giảm đủ) hoặc từ check-then-act (kho giảm đúng nhưng xuống dưới 0): 149 đơn cho 100 suất, tồn kho -49. Hai nguyên nhân khác nhau, sửa một cái không sửa được cái kia. Cách chặn chắc nhất là UPDATE có điều kiện cộng một ràng buộc `CHECK`.

Đọc thêm trong bài [[posts/2026-11-22-transactions-race|Race condition: tái hiện bán quá số hàng]].
