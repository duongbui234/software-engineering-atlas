---
title: Authorization
description: "Phân quyền: người gọi đã xác thực được làm gì."
tags: [api, security]
type: note
region: Vùng API
---

**Authorization** chạy sau authentication; thất bại thì trả `403`. Cần hai lớp: theo vai trò (role có quyền `order:read` không) và theo sở hữu (đơn hàng này có thuộc về người gọi không). Thiếu lớp thứ hai là lỗi BOLA, đứng đầu OWASP API Security Top 10.

Đọc thêm trong bài [[posts/2026-11-18-api-security|Bảo mật API]].
