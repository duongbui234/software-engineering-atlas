---
title: "Prefix Reachability"
description: "Đánh dấu những mốc mà toàn bộ tiền tố trước đó có thể ghép từ các đoạn hợp lệ."
tags: [algorithms, neetcode, dynamic-programming]
type: note
region: Vùng Thuật toán
---

Mình dùng chỉ số i làm mốc sau phần tiền tố s[0:i]. Mốc 0 tới được vì chưa cần cắt gì. Từ một mốc đã tới, một đoạn khớp tạo mốc tiếp theo mà không cần lưu lại các điểm cắt cũ.

Đọc thêm trong bài [[posts/2026-11-27-neetcode-word-break-lis|DP-04]].
