---
title: Authentication
description: "Xác thực: chứng minh người gọi là ai."
tags: [api, security]
type: note
region: Vùng API
---

**Authentication** đổi một bằng chứng (mật khẩu, OTP, token) lấy danh tính; thất bại thì trả `401`. Flash-sale luôn chạy bcrypt kể cả khi email không tồn tại để không lộ thông tin qua thời gian phản hồi, và giới hạn số lần đăng nhập sai theo cả email lẫn IP.

Đọc thêm trong bài [[2026-11-18-api-security|Bảo mật API]].
