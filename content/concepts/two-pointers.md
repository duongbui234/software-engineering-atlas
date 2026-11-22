---
title: "Two Pointers"
description: "Hai chỉ số đi từ hai đầu của mảng đã sắp xếp, mỗi bước loại một phần tử."
tags: ["algorithms"]
type: note
region: Vùng Thuật toán
---

Trên mảng tăng dần, **hai con trỏ** đặt ở đầu và cuối: tổng nhỏ quá thì dời con trỏ trái, lớn quá thì dời con trỏ phải. Mỗi bước loại được một phần tử, nên tổng O(n) và O(1) bộ nhớ. Nếu mảng chưa sắp xếp thì tốn thêm O(n log n), và phải sắp xếp chỉ số để giữ vị trí gốc. Trong JS, `sort()` mặc định so chuỗi làm hai con trỏ bỏ sót đáp án.

Đọc thêm trong bài [[posts/2026-11-22-neetcode-two-sum|Two Sum]].
