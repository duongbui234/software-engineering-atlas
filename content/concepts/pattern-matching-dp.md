---
title: "Pattern Matching DP"
description: "Bảng hai chuỗi giữa văn bản và mẫu, trong đó một ký hiệu như * có thể nuốt không hoặc nhiều ký tự."
tags: [algorithms, neetcode, dynamic-programming, string]
type: note
region: Vùng Thuật toán
---

Ô `dp[i][j]` hỏi tiền tố i ký tự của văn bản có khớp trọn tiền tố j ký tự của mẫu không. Ký tự thường và `.` đi chéo như bảng hai chuỗi. Dấu `*` đi kèm ký tự đứng trước nó: lấy không bản nào thì nhìn lùi hai cột, lấy thêm một bản thì nhìn ô ngay trên nếu ký tự văn bản khớp. Hàng 0 không toàn là false, vì mẫu như `a*b*` vẫn khớp chuỗi rỗng.

Đọc thêm trong bài [[posts/2026-11-27-neetcode-interval-dp|DP-07]] và trang [[problems/regular-expression-matching|Regular Expression Matching]].
