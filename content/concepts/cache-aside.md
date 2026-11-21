---
title: "Cache-Aside"
description: "Ứng dụng tự đọc cache, trượt thì đọc DB rồi ghi vào cache; ghi thì ghi DB trước rồi xóa cache."
tags: ["caching", "patterns"]
type: note
region: Vùng Cache
---

**Cache-aside** (lazy loading) là mẫu mặc định: cache đứng bên cạnh, không biết database. Xóa thay vì cập nhật cache khi ghi, vì xóa là idempotent. Vẫn có một khe hở hiếm gặp là race stale set.

Đọc thêm trong bài [[2026-11-22-caching-patterns|Mẫu đọc và ghi]].
