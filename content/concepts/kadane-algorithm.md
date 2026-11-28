---
title: "Kadane's Algorithm"
description: "Tìm tổng lớn nhất của một đoạn con liên tiếp trong một lượt: giữ tổng của đoạn kết thúc tại vị trí hiện tại, và bỏ đoạn cũ ngay khi nó làm tổng nhỏ hơn chính phần tử mới."
tags: [algorithms, neetcode, greedy]
type: note
region: Vùng Thuật toán
---

Mình đi từ trái sang phải và giữ `cur`, tổng lớn nhất của một đoạn kết thúc đúng tại vị trí đang đứng: `cur = max(x, cur + x)`. Nếu phần đuôi cũ đang âm thì nối vào chỉ làm tổng nhỏ đi, nên mình bỏ nó và bắt đầu lại từ `x`. Kết quả là giá trị lớn nhất mà `cur` từng đạt, tốn O(n) thời gian và O(1) bộ nhớ.

Đọc thêm trong bài [[posts/2026-11-28-neetcode-greedy-array|MISC-03]].
