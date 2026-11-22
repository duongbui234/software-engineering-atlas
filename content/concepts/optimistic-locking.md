---
title: "Optimistic Locking"
description: "Không khóa lúc đọc; lúc ghi kiểm tra version chưa đổi, đổi rồi thì thử lại."
tags: ["database", "locking"]
type: note
region: Vùng Database
---

**Khóa lạc quan** thêm cột `version` và ghi bằng `UPDATE … WHERE id = $1 AND version = <đã đọc>`, tăng version mỗi lần ghi. 0 dòng khớp nghĩa là có người ghi trước. flash-sale dùng nó cho trạng thái đơn, giỏ hàng và voucher. Hợp khi ít đụng nhau hoặc khoảng đọc-ghi dài (người dùng sửa form); trên dòng nóng, phần lớn công sức là làm rồi bỏ.

Đọc thêm trong bài [[2026-11-22-transactions-locking|Khóa bi quan và khóa lạc quan]].
