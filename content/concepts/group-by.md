---
title: "Group By"
description: "Gom các phần tử có cùng khóa vào một danh sách, bằng hash map khóa → danh sách."
tags: ["algorithms", "hashing"]
type: note
region: Vùng Thuật toán
---

**Gom nhóm** duyệt dữ liệu một lần: tính khóa, rồi thêm phần tử vào danh sách của khóa đó (`defaultdict(list)` trong Python, `computeIfAbsent` trong Java, `append(groups[k], x)` trong Go). Thứ tự các nhóm phụ thuộc map: Python và JS giữ thứ tự chèn, Java `HashMap` và Go thì không, Go còn cố ý xáo trộn mỗi lần chạy.

Đọc thêm trong bài [[posts/2026-11-22-neetcode-group-anagrams|Group Anagrams]].
