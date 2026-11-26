---
title: "Adjacency List"
description: "Cách ghi đồ thị: mỗi đỉnh giữ danh sách các đỉnh nối thẳng với nó."
tags: [algorithms, graph]
type: note
region: Vùng Thuật toán
---

**Danh sách kề** ghi một đồ thị bằng cách cho mỗi đỉnh một danh sách các hàng xóm, tức các đỉnh nối thẳng với nó bằng một cạnh. Trong đồ thị vô hướng, cạnh A–B xuất hiện hai lần: trong danh sách của A và của B, nên tổng độ dài mọi danh sách là 2E.

Cách ghi này tốn O(V + E) bộ nhớ và cho [[concepts/breadth-first-search|BFS]] đọc hàng xóm của một đỉnh trong thời gian tỉ lệ với số hàng xóm đó. Trên [[concepts/grid-graph|lưới]] mình không cần ghi danh sách vì hàng xóm tính được từ tọa độ; trong một [[concepts/implicit-graph|đồ thị ẩn]], hàng xóm được sinh theo luật.

Đọc thêm trong bài [[posts/2026-11-26-neetcode-graph-bfs|ga 2: Duyệt đồ thị và BFS]].
