---
title: HTTPS và TLS
description: "HTTP chạy trên TLS: mã hóa, toàn vẹn và xác thực server."
tags: [api, security]
type: note
region: Vùng API
---

**HTTPS** là HTTP trên TLS; TLS 1.3 (RFC 8446) bảo đảm không ai đọc trộm, không ai sửa được, và chứng chỉ chứng minh đúng server. Thường kết thúc TLS ở ingress hoặc load balancer, gửi `Strict-Transport-Security` để trình duyệt chỉ dùng HTTPS, và đặt cờ `Secure` cho cookie.

Đọc thêm trong bài [[posts/2026-11-18-api-security|Bảo mật API]].
