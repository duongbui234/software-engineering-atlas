---
title: "Choice Tree"
description: "Cây mà mỗi nút là một lời giải đang dựng dở và mỗi cạnh là một lựa chọn; quay lui chính là duyệt cây này theo chiều sâu."
tags: [algorithms, neetcode, backtracking]
type: note
region: Vùng Thuật toán
---

Mình vẽ gốc là lời giải rỗng, mỗi cạnh đi xuống là thêm một lựa chọn, và đường từ gốc tới một nút chính là `path` đang giữ. Quay lui đi theo chiều sâu trên cây này: xuống một cạnh là chọn, quay lên là gỡ. Đếm số nút của cây là cách nhanh nhất để ước lượng thời gian, ví dụ cây tập con của n phần tử có 2ⁿ nút.

Đọc thêm trong bài [[posts/2026-11-28-neetcode-subsets-combinations|MISC-01]] và trang [[problems/subsets|Subsets]].
