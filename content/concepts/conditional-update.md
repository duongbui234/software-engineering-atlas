---
title: "Conditional Update"
description: "Kiểm tra điều kiện và ghi trong cùng một câu UPDATE, rồi đếm số dòng bị ảnh hưởng."
tags: ["database", "concurrency"]
type: note
region: Vùng Database
---

**UPDATE có điều kiện**: `UPDATE … SET stock = stock - 1 WHERE id = $1 AND stock >= 1`. Điều kiện và thao tác dính nhau, giá trị mới tính trong database, và 0 dòng khớp nghĩa là hết hàng. Đây là cách flash-sale giữ hàng, xác nhận bán, dùng voucher. Nó chỉ bảo vệ luật trên chính dòng bị sửa; luật trải nhiều dòng cần thứ khác.

Đọc thêm trong bài [[2026-11-22-transactions-atomic-update|Trừ kho bằng một câu UPDATE]].
