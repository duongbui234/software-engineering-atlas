---
title: "Row Lock"
description: "Khóa mà UPDATE hoặc SELECT FOR UPDATE đặt lên một dòng, giữ tới khi transaction kết thúc."
tags: ["database", "locking", "postgres"]
type: note
region: Vùng Database
---

Mỗi `UPDATE` tự lấy **khóa dòng** (`FOR NO KEY UPDATE`, hoặc `FOR UPDATE` nếu đổi cột khóa) và giữ tới COMMIT hoặc ROLLBACK, không phải tới khi câu lệnh xong. Khóa dòng không chặn người đọc, chỉ chặn người muốn sửa, xóa hay khóa cùng dòng. Hệ quả: mọi việc chạy sau câu `UPDATE` trong transaction đều kéo dài thời gian người khác phải chờ.

Đọc thêm trong bài [[2026-11-22-transactions-atomic-update|Trừ kho bằng một câu UPDATE]].
