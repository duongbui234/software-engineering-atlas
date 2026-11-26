---
title: "Null Marker"
description: "Token dành riêng để ghi một vị trí trống trong biểu diễn của cây."
tags: [algorithms, tree, neetcode]
type: note
region: Vùng Thuật toán
---

**Dấu con trống** cho bộ đọc biết một vị trí con không chứa nút, ví dụ `#` trong [[concepts/tree-serialization|chuỗi mã hóa cây]]. Mình ghi dấu theo đúng thứ tự đã chọn, nên `8,#,3,#,#` khác `8,3,#,#,#` dù cả hai cùng có nút 8 và nút 3. Một dấu con trống phải được phân biệt với mọi giá trị hợp lệ của nút.

Đọc thêm trong bài [[posts/2026-11-26-neetcode-tree-reconstruction|ga 6: Dựng và mã hóa cây]].
