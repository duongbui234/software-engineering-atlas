---
title: "k-Sum Reduction"
description: "Giải bài tìm k số có tổng cho trước bằng cách cố định k − 2 số và chạy hai con trỏ cho hai số cuối."
tags: ["algorithms"]
type: note
region: Vùng Thuật toán
---

Bài k số quy về bài k − 1 số: cố định một số `a`, tìm k − 1 số còn lại có tổng `target − a` trên đoạn bên phải. Lặp tới khi còn hai số thì dùng [[concepts/two-pointers|hai con trỏ]] trên mảng đã sắp xếp. 3Sum thành O(n²), 4Sum O(n³), tổng quát O(n^(k−1)). Sắp xếp một lần ở đầu còn giúp [[concepts/duplicate-skipping|bỏ trùng]] mà không cần Set.

Đọc thêm trong bài [[problems/3sum|3Sum]].
