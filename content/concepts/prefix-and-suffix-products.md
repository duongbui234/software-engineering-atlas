---
title: "Prefix and Suffix Products"
description: "Tích mọi thứ trừ vị trí i bằng tích bên trái nhân tích bên phải, tính trong hai lượt quét, không chia."
tags: ["algorithms"]
type: note
region: Vùng Thuật toán
---

Lượt trái → phải ghi tích `nums[0..i-1]`, lượt phải → trái nhân thêm tích `nums[i+1..n-1]`. Không cần phép chia, nên không hỏng khi có số 0. Mỗi ô chỉ dùng một lần theo thứ tự quét, nên hai mảng phụ thu lại thành hai biến chạy và O(1) bộ nhớ phụ. Cùng họ với [[concepts/prefix-sum|Prefix Sum]].

Đọc thêm trong bài [[problems/product-of-array-except-self|Product of Array Except Self]].
