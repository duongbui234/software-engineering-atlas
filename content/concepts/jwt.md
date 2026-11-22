---
title: JSON Web Token
description: "Token tự chứa gồm header, payload và chữ ký; được ký chứ không được mã hóa."
tags: [api, security]
type: note
region: Vùng API
---

**JWT** (RFC 7519) là `header.payload.signature` mã hóa base64url. Chữ ký chống sửa nhưng không chống đọc: ai cũng decode được payload. Server phải tự quy định thuật toán chấp nhận (chống `alg: none`), giữ access token ngắn hạn, và cần allowlist hoặc blocklist nếu muốn thu hồi trước hạn.

Đọc thêm trong bài [[posts/2026-11-18-api-security|Bảo mật API]].
