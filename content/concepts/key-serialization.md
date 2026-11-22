---
title: "Key Serialization"
description: "Biến một giá trị có cấu trúc thành chuỗi làm khóa, sao cho không hai giá trị khác nhau cho cùng một chuỗi."
tags: ["algorithms", "hashing"]
type: note
region: Vùng Thuật toán
---

Nối bảng đếm `[1, 11, …]` và `[11, 1, …]` không có dấu phân cách đều ra `"1110…"`, nên hai từ không phải anagram bị gom chung, và lỗi này vẫn qua mọi ví dụ của đề. **Nối khóa** đúng cần dấu phân cách (`count.join('#')`) hoặc định dạng độ dài cố định (Java: mỗi ô một `char`). Nguyên tắc: phải đọc ngược được chuỗi ra đúng giá trị ban đầu.

Đọc thêm trong bài [[problems/group-anagrams|Group Anagrams]].
