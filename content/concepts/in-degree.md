---
title: "In-degree"
description: "Số cạnh đi vào một đỉnh, tức số việc còn phải xong trước nó; thuật toán Kahn xoay quanh con số này."
tags: [algorithms, graph, topological-sort]
type: note
region: Vùng Thuật toán
---

**Bậc vào** của một đỉnh là số cạnh chỉ vào nó: số môn tiên quyết còn chưa học. Đỉnh có bậc vào 0 làm được ngay.

Thuật toán Kahn bỏ mọi đỉnh bậc vào 0 vào một [[concepts/queue|hàng đợi]], lấy từng đỉnh ra, ghi vào kết quả, rồi trừ 1 bậc vào của mỗi hàng xóm; hàng xóm nào về 0 thì vào hàng. Nếu cuối cùng lấy ra ít hơn số đỉnh, những đỉnh còn lại kẹt trong một vòng: đồ thị không phải [[concepts/directed-acyclic-graph|DAG]]. Bẫy hay gặp: cạnh trùng phải đếm đúng một lần, nếu không bậc vào không bao giờ về 0.

Đọc thêm trong bài [[posts/2026-11-26-neetcode-topological-sort|ga 3: Sắp xếp topo]].
