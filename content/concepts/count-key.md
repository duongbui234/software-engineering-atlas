---
title: "Count Key"
description: "Dùng bảng đếm tần suất làm khóa thay cho chuỗi đã sắp xếp."
tags: ["algorithms", "hashing"]
type: note
region: Vùng Thuật toán
---

**Khóa đếm** tạo trong O(k) thay vì O(k log k) của khóa sắp xếp. Đo với 10 000 từ: nhanh hơn 47 lần khi từ dài 1000 chữ, nhưng chậm hơn khi từ chỉ dài 5 chữ, vì luôn phải dựng và nối 26 con số. Bảng đếm là mảng, nên cần đổi sang dạng làm khóa được: tuple (Python), mảng cố định (Go), chuỗi (JS, Java).

Đọc thêm trong bài [[2026-11-22-neetcode-group-anagrams|Group Anagrams]].
