---
title: "Prefix Maximum"
description: "L[i] = giá trị lớn nhất từ đầu mảng tới i, tính trong một lượt bằng một biến chạy."
tags: ["algorithms"]
type: note
region: Vùng Thuật toán
---

**Max tiền tố** `L[i] = max(h[0..i])` tính trong một lượt: `L[i] = max(L[i − 1], h[i])`. Đi từ phải sang thì được max hậu tố. Cùng khuôn với tổng tiền tố và tích tiền tố, chỉ đổi phép toán; Python viết gọn là `accumulate(h, max)`. Khi mỗi vị trí chỉ cần max hai bên **tại thời điểm** xét nó, [[concepts/two-pointers|hai con trỏ]] thay được hai mảng bằng hai biến.

Đọc thêm trong bài [[problems/trapping-rain-water|Trapping Rain Water]].
