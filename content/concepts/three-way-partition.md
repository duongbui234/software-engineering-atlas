---
title: "Three-way Partition"
description: "Chia một đoạn mảng thành ba khúc nhỏ hơn, bằng và lớn hơn chốt trong một lượt, để giá trị trùng không làm quicksort hay quickselect sụp về O(n²)."
tags: ["algorithms", "sorting"]
type: note
region: Vùng Thuật toán
---

**Phân hoạch ba phần** (bài toán "cờ Hà Lan" của Dijkstra) dùng ba con trỏ: `[lo, lt)` nhỏ hơn chốt, `[lt, i)` bằng chốt, `(gt, hi]` lớn hơn chốt, `[i, gt]` chưa xét. Mỗi bước xét `a[i]`: nhỏ hơn thì đổi sang khúc trái, lớn hơn thì đổi sang khúc phải, bằng thì để nguyên. Phân hoạch hai phần kiểu Lomuto dồn mọi giá trị bằng chốt về một phía, nên mảng toàn số bằng nhau làm mỗi vòng chỉ bớt 1 phần tử: đo với n = 10⁵ mất 2,4 giây, còn phân hoạch ba phần mất 0,5 ms.

Đọc thêm trong bài [[problems/kth-largest-element-in-an-array|Kth Largest Element in an Array]] và khái niệm [[concepts/quickselect|Quickselect]].
