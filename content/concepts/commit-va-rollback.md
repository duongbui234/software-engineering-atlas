---
title: "Commit và Rollback"
description: "COMMIT chốt cả khối thay đổi; ROLLBACK bỏ cả khối."
tags: ["database", "transaction"]
type: note
region: Vùng Database
---

**COMMIT** làm mọi thay đổi trong transaction hiện ra với các session khác cùng một lúc. **ROLLBACK** bỏ chúng. Rollback xảy ra khi code yêu cầu, khi một câu lệnh lỗi (sau đó Postgres từ chối mọi câu tiếp theo cho tới khi rollback), hoặc khi kết nối đứt giữa chừng. Trường hợp cuối là quan trọng nhất: pod chết thì không code dọn dẹp nào chạy được, nhưng database vẫn dọn đúng.

Đọc thêm trong bài [[2026-11-22-transactions-acid|Transaction là gì]].
