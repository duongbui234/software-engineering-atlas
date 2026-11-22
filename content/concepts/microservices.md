---
title: Microservices
description: "Kiến trúc chia hệ thống thành nhiều service nhỏ, mỗi cái sở hữu dữ liệu riêng."
tags: [api, architecture]
type: note
region: Vùng API
---

**Microservices** cho mỗi team triển khai và scale phần của mình độc lập, đổi lại JOIN thành lời gọi mạng, transaction thành saga, và thêm độ trễ, lỗi mạng, độ phức tạp vận hành. Nên bắt đầu bằng modular monolith (MonolithFirst) và tách dần theo kiểu strangler fig khi ranh giới đã rõ.

Đọc thêm trong bài [[posts/2026-11-18-api-architecture|Kiến trúc và vận hành API]].
