---
title: "LCS Table"
description: "Bảng độ dài dãy con chung dài nhất của mọi cặp tiền tố, đi chéo khi hai ký tự cuối khớp."
tags: [algorithms, neetcode, dynamic-programming, string]
type: note
region: Vùng Thuật toán
---

Ô (i, j) lưu độ dài dãy con chung dài nhất của `a[0:i]` và `b[0:j]`. Nếu hai ký tự cuối bằng nhau, mình lấy ô chéo cộng 1; nếu khác, bỏ ký tự cuối của một trong hai chuỗi và lấy giá trị lớn hơn của ô trên và ô trái. Muốn in ra chính dãy con thì phải giữ cả bảng để đi ngược từ góc dưới phải.

Đọc thêm trong bài [[posts/2026-11-27-neetcode-grid-two-strings|DP-05]] và trang [[problems/longest-common-subsequence|Longest Common Subsequence]].
