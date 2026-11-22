---
title: "Check Constraint"
description: "Ràng buộc khai báo trên bảng mà database tự kiểm tra ở mọi câu ghi."
tags: ["database", "postgres"]
type: note
region: Vùng Database
---

Một **ràng buộc CHECK** như `CHECK (stock >= 0)` hay `CHECK (sold_count <= allocated_stock)` làm database từ chối mọi câu ghi tạo ra dòng vi phạm (lỗi `23514`), bất kể code nào gửi. Nó bắt những đường ghi không đi qua code chính (script admin, migration, code mới quên điều kiện) và biến bug thành lỗi rõ ràng thay vì dữ liệu sai im lặng. Đây là lớp phòng thủ cuối cùng.

Đọc thêm trong bài [[2026-11-22-transactions-atomic-update|Trừ kho bằng một câu UPDATE]].
