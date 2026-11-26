---
title: "Disjoint Set Union"
description: "Duy trì các tập rời nhau bằng thao tác tìm gốc và gộp."
tags: [algorithms, neetcode, graph, union-find]
type: note
region: Vùng Thuật toán
---

Mình dùng DSU để duy trì một phân hoạch. Mỗi phần tử thuộc đúng một tập và `find(x)` trả gốc đại diện. `union(a,b)` gắn hai gốc nếu chúng khác nhau. Các con trỏ của DSU biểu diễn tập, còn cạnh gốc của đồ thị nằm ở đầu vào.

Đọc thêm trong bài [[posts/2026-11-27-neetcode-union-find|Union-Find]].
