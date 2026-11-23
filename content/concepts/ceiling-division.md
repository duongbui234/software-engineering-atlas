---
title: "Ceiling Division"
description: "Chia làm tròn lên ⌈p / k⌉ chỉ bằng số nguyên: (p + k − 1) / k, hoặc -(-p // k) trong Python; tránh đi qua số thực, vốn sai khi số vượt 2⁵³."
tags: ["algorithms", "numbers"]
type: note
region: Vùng Thuật toán
---

Phép chia nguyên của hầu hết ngôn ngữ làm tròn **xuống** (với số dương), nhưng nhiều bài cần làm tròn **lên**: 7 quả chuối, mỗi giờ ăn 4, mất ⌈7 / 4⌉ = 2 giờ chứ không phải 1. Với p ≥ 0 và k > 0, `(p + k − 1) / k` ra đúng ⌈p / k⌉. Python viết `-(-p // k)`, vì `//` làm tròn xuống cả với số âm. Cách `Math.ceil(p / k)` đi qua số thực 64 bit: đúng khi p và k nhỏ (tới 10⁹ thì không bao giờ lệch), nhưng sai khi p vượt 2⁵³, ví dụ `math.ceil((2**53 + 1) / 1)` trong Python ra 2⁵³. Bẫy còn lại là tràn: `p + k − 1` có thể vượt `int` 32 bit khi p và k cùng gần 2³¹; `(p − 1) / k + 1` tránh được, nhưng với p = 0 thì Java, Go, C ra 1 thay vì 0, vì phép chia của chúng cắt về 0.

Đọc thêm trong bài [[problems/koko-eating-bananas|Koko Eating Bananas (LC 875)]].
