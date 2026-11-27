---
title: "Interval DP"
description: "Đặt trạng thái là một đoạn con (l, r), giải các đoạn ngắn trước, rồi chọn điểm chia k bên trong đoạn."
tags: [algorithms, neetcode, dynamic-programming]
type: note
region: Vùng Thuật toán
---

Khi đáp án của cả mảng phụ thuộc vào cách chia mảng thành hai nửa, mình đặt `dp[l][r]` là đáp án tốt nhất cho riêng đoạn từ l đến r. Mỗi đoạn thử mọi điểm chia k và ghép `dp[l][k]` với `dp[k][r]`, nên phải điền theo độ dài đoạn tăng dần để hai nửa ngắn hơn luôn có sẵn. Có O(n²) đoạn, mỗi đoạn thử O(n) điểm chia, tổng O(n³).

Đọc thêm trong bài [[posts/2026-11-27-neetcode-interval-dp|DP-07]] và trang [[problems/burst-balloons|Burst Balloons]].
