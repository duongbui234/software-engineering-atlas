---
title: "Amortized O(1)"
description: "Một thao tác thỉnh thoảng đắt, nhưng chia đều cho mọi lần thì vẫn là hằng số."
tags: ["algorithms", "complexity"]
type: note
region: Vùng Thuật toán
---

Hash table nới gấp đôi khi đầy (Java ở load factor 0,75, Python ở khoảng 2/3), và lần nới đó phải chép mọi khóa, O(n). Nhưng vì nới gấp đôi, tổng số lần chép sau n lần ghi chưa tới 2n, nên trung bình mỗi lần ghi là **O(1) khấu hao**. Phép đo `Map.set` trên V8: 100–250 ns mỗi lần dù n tăng 4 000 lần.

Đọc thêm trong bài [[2026-11-22-neetcode-two-sum|Two Sum]].
