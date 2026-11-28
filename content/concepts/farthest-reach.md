---
title: "Farthest Reach"
description: "Chỉ số xa nhất có thể tới được tính đến vị trí hiện tại; vì các ô tới được luôn tạo thành một đoạn liền từ đầu mảng, một con số này thay được cả mảng đánh dấu."
tags: [algorithms, neetcode, greedy]
type: note
region: Vùng Thuật toán
---

Trong bài nhảy trên mảng, nếu tới được ô j thì mọi ô trước j cũng tới được, vì đường nhảy nào cũng đi qua hoặc vượt qua chúng. Vậy tập ô tới được luôn là một đoạn `[0, reach]`, và mình chỉ cần giữ `reach = max(reach, i + nums[i])` khi đi qua từng ô. Gặp ô `i > reach` nghĩa là có một khoảng trống không vượt qua được.

Đọc thêm trong bài [[posts/2026-11-28-neetcode-greedy-array|MISC-03]].
