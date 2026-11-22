---
title: "Serializable"
description: "Mức cao nhất: kết quả giống như các transaction chạy lần lượt theo một thứ tự nào đó."
tags: ["database", "isolation", "postgres"]
type: note
region: Vùng Database
---

**Serializable** trong Postgres cài bằng Serializable Snapshot Isolation (SSI): Snapshot Isolation cộng việc ghi lại ai đọc gì, ai ghi gì. Phát hiện vòng phụ thuộc thì nó hủy một bên với `40001`. Khóa của SSI không chặn ai nên không gây deadlock; Serializable không "khóa cả bảng". Cái giá là app bắt buộc phải retry, và trên một dòng nóng số lần retry rất lớn.

Đọc thêm trong bài [[2026-11-22-transactions-isolation|Các mức isolation trong Postgres]].
