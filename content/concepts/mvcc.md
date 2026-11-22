---
title: "MVCC"
description: "UPDATE tạo phiên bản dòng mới thay vì sửa tại chỗ, để người đọc không phải chờ người ghi."
tags: ["database", "postgres"]
type: note
region: Vùng Database
---

**MVCC** (multi-version concurrency control): mỗi `UPDATE` tạo một phiên bản dòng mới, đánh dấu bản cũ là hết hạn từ transaction đó (cột hệ thống `xmin`, `xmax`, `ctid`). Mỗi session đọc phiên bản mà nó được phép thấy, nên không ai thấy dữ liệu chưa commit và người đọc không chờ người ghi. Cái giá: phiên bản cũ nằm lại cho tới khi `VACUUM` dọn, và transaction mở lâu giữ chúng lại.

Đọc thêm trong bài [[posts/2026-11-22-transactions-acid|Transaction là gì]].
