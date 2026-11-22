---
title: "Advisory Lock"
description: "Khóa theo một con số do app chọn, không gắn với dòng hay bảng nào."
tags: ["database", "locking", "postgres"]
type: note
region: Vùng Database
---

Một **advisory lock** chỉ có ý nghĩa do app quy ước. Bản theo session giữ tới khi unlock hoặc session đóng, kể cả khi rollback, nên dễ treo qua connection pool; bản theo transaction (`pg_advisory_xact_lock`) tự nhả khi transaction kết thúc. flash-sale dùng `pg_try_advisory_xact_lock(hashtext("…"))` để một cron chỉ chạy trên một pod mỗi lượt, không cần khóa phân tán riêng.

Đọc thêm trong bài [[2026-11-22-transactions-locking|Khóa bi quan và khóa lạc quan]].
