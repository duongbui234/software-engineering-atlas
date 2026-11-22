---
title: "Atomic Gate"
description: "Một script Lua trong Redis kiểm tra và trừ suất nguyên tử, chặn phần lớn người mua trước database."
tags: ["redis", "flash-sale", "concurrency"]
type: note
region: Vùng Database
---

**Cổng nguyên tử** của flash-sale là một script Lua: kiểm tra chiến dịch còn chạy, kiểm tra giới hạn mỗi người, `DECRBY` kho (âm thì cộng lại và từ chối), ghi quota. Redis chạy trọn script trước lệnh khác nên không có khe hở read-modify-write hay write skew. 3000 người bấm, chỉ 100 transaction tới Postgres. Script không có rollback: lệnh đã chạy thì đã có hiệu lực.

Đọc thêm trong bài [[2026-11-22-transactions-flash-sale|Flash sale không bán quá số hàng]].
