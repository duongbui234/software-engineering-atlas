---
title: "Lock Timeout"
description: "Giới hạn thời gian chờ một khóa; quá hạn thì câu lệnh bị hủy với 55P03."
tags: ["database", "postgres", "reliability"]
type: note
region: Vùng Database
---

`lock_timeout` hủy câu lệnh khi một lần chờ khóa vượt quá thời gian đặt, với lỗi `55P03`. Mặc định là 0 (chờ vô hạn), giống `statement_timeout` và `idle_in_transaction_session_timeout`. Đặt bằng `SET LOCAL lock_timeout = "500ms"` cho đường đi nóng để request thất bại nhanh và báo "đang đông, thử lại" thay vì kéo cả pool kết nối treo theo.

Đọc thêm trong bài [[posts/2026-11-22-transactions-deadlock|Deadlock và transaction dài]].
