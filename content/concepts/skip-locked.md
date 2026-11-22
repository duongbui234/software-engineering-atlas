---
title: "SKIP LOCKED"
description: "NOWAIT báo lỗi ngay khi gặp dòng bị khóa; SKIP LOCKED bỏ qua dòng đó và lấy dòng khác."
tags: ["database", "locking", "postgres"]
type: note
region: Vùng Database
---

`FOR UPDATE NOWAIT` báo lỗi `55P03` thay vì chờ. `FOR UPDATE SKIP LOCKED` bỏ qua các dòng đang bị khóa, cho nhiều worker cùng lấy việc từ một bảng kiểu hàng đợi mà không chờ nhau. Tài liệu Postgres nhắc nó cho góc nhìn không nhất quán, nên không dùng để đếm hay tính tổng. flash-sale dùng nó cho cron hủy đơn quá hạn chạy trên mọi pod.

Đọc thêm trong bài [[2026-11-22-transactions-locking|Khóa bi quan và khóa lạc quan]].
