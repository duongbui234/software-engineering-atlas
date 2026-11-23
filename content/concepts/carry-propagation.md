---
title: "Carry Propagation"
description: "Cộng hai số theo từng chữ số từ hàng thấp lên, mang phần nhớ sang hàng kế; vòng lặp chỉ dừng khi hết cả hai số và hết số nhớ."
tags: ["algorithms"]
type: note
region: Vùng Thuật toán
---

Cộng tay hai số: cộng hai chữ số cùng hàng và số nhớ từ hàng trước, ghi `s % 10`, mang `s / 10` (0 hoặc 1 khi cộng hai số thập phân) sang hàng kế. **Mang số nhớ** là đúng quy trình đó viết thành vòng lặp. Hai chỗ hay sai: hai số dài khác nhau (hết một số thì coi chữ số của nó là 0), và số nhớ cuối cùng (999 + 1 cần thêm một chữ số), nên điều kiện lặp là `a || b || carry`.

Dùng ở [[problems/add-two-numbers|Add Two Numbers]], nơi mỗi số là một [[concepts/linked-list|danh sách liên kết]] chữ số viết ngược (nút đầu là hàng đơn vị), và kết quả được nối sau một [[concepts/dummy-node|nút giả]]. Cùng ý đó có trong Plus One, Add Binary, và trong phép cộng số lớn của các thư viện như `BigInt`.

Đọc thêm trong bài [[posts/2026-11-24-neetcode-advanced-linked-list|Danh sách liên kết nâng cao]].
