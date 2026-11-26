---
title: "Tree Reconstruction"
description: "Dựng lại hình dạng cây từ các thứ tự duyệt đủ thông tin để tách nhánh."
tags: [algorithms, tree, neetcode]
type: note
region: Vùng Thuật toán
---

**Dựng lại cây** là khôi phục cả giá trị và vị trí trái, phải của từng nút. Với các giá trị phân biệt, [[concepts/pre-order-traversal|preorder]] cho mình gốc kế tiếp và [[concepts/inorder-interval|khoảng inorder]] cho mình cách chia hai nhánh. Nếu chỉ có preorder và postorder mà một nút có đúng một con, hai dãy không cho biết con đó ở bên nào.

Đọc thêm trong bài [[posts/2026-11-26-neetcode-tree-reconstruction|ga 6: Dựng và mã hóa cây]].
