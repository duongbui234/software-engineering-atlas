---
title: CORS
description: "Cơ chế để server cho phép JavaScript từ origin khác đọc response; do trình duyệt thực thi."
tags: [api, security]
type: note
region: Vùng API
---

**CORS** nới lỏng Same-Origin Policy: server trả `Access-Control-Allow-Origin` để cho phép trang ở origin khác đọc response, request phức tạp thì trình duyệt hỏi trước bằng preflight `OPTIONS`. CORS bảo vệ người dùng trong trình duyệt, không chặn `curl`, không thay được authentication và không chống CSRF.

Đọc thêm trong bài [[2026-11-18-api-security|Bảo mật API]].
