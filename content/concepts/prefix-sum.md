---
title: "Prefix Sum"
description: "Mảng P với P[i] là tổng a[0..i-1]: tổng một đoạn bất kỳ là hiệu hai ô."
tags: ["algorithms"]
type: note
region: Vùng Thuật toán
---

**Tổng tiền tố** tính một lần trong O(n): `P[0] = 0`, `P[i+1] = P[i] + a[i]`. Sau đó tổng của `a[l..r]` là `P[r+1] − P[l]`, trả lời trong O(1). Ý này mở rộng cho mọi phép kết hợp được (tích, max, XOR), nhưng chỉ phép **đảo được** như cộng và XOR mới lấy được đoạn giữa bằng một phép trừ; tích thì phải ghép với [[concepts/prefix-and-suffix-products|hậu tố]].

Đọc thêm trong bài [[posts/2026-11-23-neetcode-prefix-suffix-encoding|ga 3: Tiền tố, hậu tố và mã hóa]].
