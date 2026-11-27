---
title: "Two-Sequence DP"
description: "Đặt dp[i][j] là đáp án cho tiền tố i ký tự của chuỗi thứ nhất và j ký tự của chuỗi thứ hai."
tags: [algorithms, neetcode, dynamic-programming, string]
type: note
region: Vùng Thuật toán
---

Với hai chuỗi, mình hỏi về hai tiền tố cùng lúc: `a[0:i]` và `b[0:j]`. Hàng 0 và cột 0 ứng với tiền tố rỗng, nên bảng có kích thước (m + 1) × (n + 1). Mỗi ô chỉ đọc ô trên, ô trái và ô chéo trên trái, tức là bỏ ký tự cuối của một chuỗi hoặc của cả hai. Vì vậy có thể giữ một hàng và một biến tạm cho ô chéo khi chỉ cần con số cuối cùng.

Đọc thêm trong bài [[posts/2026-11-27-neetcode-grid-two-strings|DP-05]].
