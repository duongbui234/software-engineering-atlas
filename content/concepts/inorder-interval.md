---
title: "Inorder Interval"
description: "Khoảng chỉ số liên tiếp trong dãy trung thứ tự chứa đúng các nút của một cây con."
tags: [algorithms, tree, neetcode]
type: note
region: Vùng Thuật toán
---

Trong [[concepts/in-order-traversal|trung thứ tự]], các nút của một cây con nằm trong một khoảng liên tiếp. Nếu khoảng là `[lo, hi)` và gốc ở `split`, hai khoảng con là `[lo, split)` và `[split + 1, hi)`. Khi dựng cây từ preorder và inorder, mình giữ chỉ số thay vì sao chép các đoạn mảng, và một khoảng rỗng không lấy thêm giá trị nào từ preorder.

Đọc thêm trong bài [[posts/2026-11-26-neetcode-tree-reconstruction|ga 6: Dựng và mã hóa cây]].
