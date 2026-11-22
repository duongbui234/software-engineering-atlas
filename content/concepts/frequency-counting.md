---
title: "Frequency Counting"
description: "Đếm mỗi giá trị xuất hiện bao nhiêu lần, rồi trả lời câu hỏi trên bảng đếm."
tags: ["algorithms", "hashing"]
type: note
region: Vùng Thuật toán
---

**Đếm tần suất** biến các câu hỏi "cùng thành phần" (anagram) hay "phổ biến nhất" (top k) thành phép so sánh hoặc xếp hạng trên một bảng đếm. Một Set chỉ nhớ "có hay không"; bảng đếm nhớ "bao nhiêu", nên phân biệt được `aacc` với `ccac`. Bảng đếm có thể là mảng (khi tập giá trị nhỏ, biết trước) hoặc hash map.

Đọc thêm trong bài [[problems/valid-anagram|Valid Anagram]].
