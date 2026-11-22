---
title: "ACID"
description: "Bốn lời hứa của transaction: Atomicity, Consistency, Isolation, Durability."
tags: ["database", "transaction"]
type: note
region: Vùng Database
---

**ACID**: Atomicity (cả khối hoặc không), Consistency (luật của dữ liệu vẫn đúng sau mỗi transaction), Isolation (transaction chạy cùng lúc không thấy trạng thái dở dang của nhau), Durability (đã commit thì không mất). Chữ C chủ yếu là trách nhiệm của người viết: database chỉ giữ những luật được khai báo bằng ràng buộc. Chữ I có nhiều mức, và mức mặc định của Postgres không chặn được bán quá số hàng.

Đọc thêm trong bài [[2026-11-22-transactions-acid|Transaction là gì]].
