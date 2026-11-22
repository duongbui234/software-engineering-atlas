---
title: "Access Control"
description: "Xác thực và ba quyền configure, write, read theo từng vhost."
tags: [rabbitmq, messaging]
type: note
region: Vùng Messaging
---

Xác thực bằng password, chứng chỉ x.509 hoặc JWT qua plugin OAuth 2. Phân quyền theo vhost với ba regex: **configure** (tạo, xóa tài nguyên), **write** (gửi tin, bind), **read** (nhận tin); thêm topic permission cho routing key. `guest` chỉ đăng nhập từ localhost; production nên xóa nó, tắt ANONYMOUS, mỗi ứng dụng một user, bật TLS.

Đọc thêm trong bài [[posts/2026-11-21-rabbitmq-operations|Vận hành RabbitMQ trong production]].
