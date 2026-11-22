---
title: Filtering và Sorting
description: "Lọc và sắp xếp kết quả theo tham số của client."
tags: [api, performance]
type: note
region: Vùng API
---

**Lọc và sắp xếp** qua query string cần chuyển kiểu tường minh (query string luôn là string, `Boolean("false")` là `true`), whitelist trường được sort, luôn có khóa phụ, giới hạn đầu vào và có index phù hợp. Tham số đã nhận thì phải dùng; nhận rồi bỏ qua khiến client tưởng đang lọc.

Đọc thêm trong bài [[posts/2026-11-18-api-performance|Hiệu năng API]].
