---
title: "Bitmask"
description: "Dùng từng bit của một số nguyên làm một ô đúng/sai: tập nhỏ vừa trong một số, kiểm và ghi bằng phép AND, OR."
tags: ["algorithms", "bits"]
type: note
region: Vùng Thuật toán
---

Khi các phần tử có thể có chỉ nằm trong một khoảng nhỏ (chữ số 1..9, 26 chữ cái), một **bitmask** thay cho cả một Set: bit k bật nghĩa là "đã có phần tử k". Kiểm là `mask & (1 << k)`, ghi là `mask |= 1 << k`, hợp hai tập là `a | b`. Không có hash, không cấp phát, nên nhanh hơn [[concepts/hash-set|Hash Set]] nhiều lần dù cùng O(1). Giới hạn: số phần tử phải vừa số bit của kiểu số (32 hoặc 64), và trong JavaScript phép trên bit luôn cắt về 32 bit.

Đọc thêm trong bài [[problems/valid-sudoku|Valid Sudoku]].
