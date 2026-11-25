---
title: "In-order Traversal"
description: "Thăm cây con trái, rồi nút, rồi cây con phải; trên cây nhị phân tìm kiếm, thứ tự đó chính là thứ tự tăng dần của các giá trị."
tags: ["algorithms", "tree", "binary-search-tree"]
type: note
region: Vùng Thuật toán
---

**Duyệt trung thứ tự** (in-order) xử lý một nút **giữa** hai lần đi xuống hai con: cả cây con trái trước, rồi nút, rồi cả cây con phải. Trên một [[concepts/binary-tree|cây nhị phân]] bất kỳ thứ tự này không có ý nghĩa gì đặc biệt; trên [[concepts/binary-search-tree|cây nhị phân tìm kiếm]] nó cho ra các giá trị **tăng dần**, vì mọi thứ bên trái nhỏ hơn nút và mọi thứ bên phải lớn hơn.

Chiều ngược lại cũng đúng: một cây nhị phân là BST (không có giá trị trùng) khi và chỉ khi dãy trung thứ tự của nó tăng ngặt. Đó là một cách kiểm BST chỉ cần nhớ giá trị vừa thăm.

Bản không đệ quy dùng một [[concepts/stack|ngăn xếp]]: đi trái hết mức và đẩy từng nút, lấy nút trên cùng ra xử lý, rồi sang cây con phải của nó và lặp lại. Bản này **dừng được giữa chừng**, nên tìm phần tử nhỏ thứ k chỉ tốn O(h + k) chứ không phải O(n). Khác với [[concepts/post-order-traversal|hậu thứ tự]], nút được xử lý trước khi cây con phải được thăm.

Đọc thêm trong bài [[posts/2026-11-25-neetcode-binary-search-tree|ga 4: Cây nhị phân tìm kiếm]].
