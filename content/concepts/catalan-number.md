---
title: "Catalan Number"
description: "Dãy 1, 1, 2, 5, 14, 42, … đếm số chuỗi n cặp ngoặc hợp lệ và nhiều cấu trúc lồng nhau khác; tăng xấp xỉ 4ⁿ / n^1,5."
tags: ["algorithms", "combinatorics"]
type: note
region: Vùng Thuật toán
---

**Số Catalan** `C(n) = (2n)! / ((n+1)! · n!)` đếm số chuỗi gồm n cặp ngoặc đóng mở đúng, số cây nhị phân có n nút, số cách đặt ngoặc cho một tích n + 1 thừa số. Mười giá trị đầu từ n = 1: 1, 2, 5, 14, 42, 132, 429, 1 430, 4 862, 16 796 (dãy A000108 trong OEIS). Nó tăng xấp xỉ `4ⁿ / (n^1,5 · √π)`, nên một bài yêu cầu **liệt kê** các cấu trúc này không thể chạy nhanh hơn cỡ đó; [[concepts/backtracking|quay lui]] tốt chỉ bớt phần phí ngoài đầu ra.

Đọc thêm trong bài [[problems/generate-parentheses|Generate Parentheses]].
