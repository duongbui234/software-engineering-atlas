---
title: "Deadlock"
description: "Vòng chờ: mỗi transaction giữ một khóa mà transaction kế tiếp cần."
tags: ["database", "locking", "postgres"]
type: note
region: Vùng Database
---

Một **deadlock** xảy ra khi giỏ X giữ khóa SKU A và chờ B, còn giỏ Y giữ B và chờ A. Postgres chờ `deadlock_timeout` (mặc định 1 giây), phát hiện vòng chờ và hủy một transaction với `40P01`; bên nào bị hủy thì không đoán được. Mỗi deadlock là ít nhất một giây chờ và một request thất bại. Cách phòng là khóa theo thứ tự, không phải retry.

Đọc thêm trong bài [[2026-11-22-transactions-deadlock|Deadlock và transaction dài]].
