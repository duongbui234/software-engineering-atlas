---
title: "Tree Serialization"
description: "Mã hóa giá trị và hình dạng của cây thành dữ liệu có thể lưu rồi đọc lại."
tags: [algorithms, tree, neetcode]
type: note
region: Vùng Thuật toán
---

Khi **mã hóa cây**, mình chọn một thứ tự duyệt và một quy ước biểu diễn đủ để dựng lại từng cạnh. Ví dụ, preorder ghi giá trị gốc rồi ghi hai cây con, dùng [[concepts/null-marker|dấu con trống]] cho cây rỗng. Một phép thử đi-về cần so cả hình dạng lẫn giá trị, vì một dãy giá trị duyệt có thể giống nhau trên hai hình dạng khác nhau.

Đọc thêm trong bài [[posts/2026-11-26-neetcode-tree-reconstruction|ga 6: Dựng và mã hóa cây]].
