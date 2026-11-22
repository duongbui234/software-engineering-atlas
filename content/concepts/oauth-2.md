---
title: OAuth 2.0
description: "Giao thức ủy quyền: cho ứng dụng truy cập dữ liệu thay người dùng mà không cần mật khẩu."
tags: [api, security]
type: note
region: Vùng API
---

**OAuth 2.0** cấp access token có scope cho một ứng dụng, sau khi người dùng đồng ý ở authorization server. Luồng nên dùng hiện nay là Authorization Code + PKCE; implicit và password grant đã bị khuyến nghị bỏ (RFC 9700). OAuth là ủy quyền, phần đăng nhập là OpenID Connect.

Đọc thêm trong bài [[posts/2026-11-18-api-security|Bảo mật API]].
