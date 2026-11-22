---
title: "Transaction Retry"
description: "Chạy lại cả transaction khi gặp 40001 hoặc 40P01, có giới hạn và jitter."
tags: ["database", "reliability"]
type: note
region: Vùng Database
---

**Thử lại transaction** đúng cách: chạy lại từ câu đầu tiên, chỉ cho `40001` (serialization failure) và `40P01` (deadlock), Prisma gộp thành `P2034`; giới hạn số lần; chờ lũy thừa có jitter; không có tác dụng phụ bên ngoài trong khối. Nhưng retry chỉ là lưới: 20 giỏ ngược thứ tự khóa, retry tối đa 5 lần vẫn chỉ 8 giỏ xong, còn sắp xếp SKU thì 20/20.

Đọc thêm trong bài [[2026-11-22-transactions-deadlock|Deadlock và transaction dài]].
