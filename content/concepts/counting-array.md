---
title: "Counting Array"
description: "Mảng cố định dùng chính giá trị làm chỉ số để đếm, khi tập giá trị nhỏ và biết trước."
tags: ["algorithms"]
type: note
region: Vùng Thuật toán
---

Với chữ thường a–z, `count[c - 'a']` là ngăn của chữ c trong một **mảng đếm** 26 ô. Không cần tính hash, nên nhanh hơn hash map nhiều lần (3,4 ms so với 40 ms với một triệu chữ), và bộ nhớ là O(1) vì kích thước cố định. Nó chỉ đúng khi giả định về input đúng: chữ hoa, dấu cách hay chữ có dấu sẽ ghi ra ngoài mảng.

Đọc thêm trong bài [[2026-11-22-neetcode-valid-anagram|Valid Anagram]].
