---
title: "Sort Then Scan"
description: "Sắp xếp trước để các giá trị bằng nhau nằm liền nhau, rồi chỉ so phần tử kề nhau."
tags: ["algorithms", "sorting"]
type: note
region: Vùng Thuật toán
---

**Sắp xếp rồi quét** đổi một câu hỏi về mọi cặp thành câu hỏi về các cặp kề nhau, với chi phí O(n log n) của bước sắp xếp. Bộ nhớ phụ gần như bằng 0 nếu sắp xếp tại chỗ, nhưng khi đó input của người gọi bị sửa. Trong JS phải truyền hàm so sánh: `sort()` mặc định so các phần tử như chuỗi.

Đọc thêm trong bài [[2026-11-22-neetcode-contains-duplicate|Contains Duplicate]].
