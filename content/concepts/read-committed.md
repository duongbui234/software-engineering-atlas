---
title: "Read Committed"
description: "Mức mặc định của Postgres: mỗi câu lệnh thấy dữ liệu đã commit tính tới lúc câu đó bắt đầu."
tags: ["database", "isolation", "postgres"]
type: note
region: Vùng Database
---

Ở **Read Committed**, mỗi câu lệnh lấy một snapshot mới, nên hai câu `SELECT` trong cùng transaction có thể thấy hai con số khác nhau. Khi `UPDATE` gặp dòng đang bị sửa, nó chờ rồi chạy lại `WHERE` trên phiên bản mới nhất. Hành vi đó gây lost update cho code read-modify-write, nhưng lại làm cho UPDATE có điều kiện đúng mà không cần retry. Prisma cũng dùng mức này nếu không chỉ định.

Đọc thêm trong bài [[2026-11-22-transactions-isolation|Các mức isolation trong Postgres]].
