---
title: "Serialization Failure"
description: "Lỗi 40001: transaction không thể commit mà vẫn đúng, phải làm lại từ đầu."
tags: ["database", "isolation", "reliability"]
type: note
region: Vùng Database
---

**Serialization failure** (SQLSTATE `40001`) là cách Repeatable Read và Serializable nói "làm lại đi", không phải bug. Phải `ROLLBACK` rồi chạy lại **cả transaction** để lấy snapshot mới, có giới hạn số lần và chờ ngẫu nhiên. Prisma báo nó cùng deadlock bằng mã `P2034`. Không retry thì lỗi đi thẳng ra người dùng: 293 trên 300 người trong ví dụ của tuyến.

Đọc thêm trong bài [[posts/2026-11-22-transactions-isolation|Các mức isolation trong Postgres]].
