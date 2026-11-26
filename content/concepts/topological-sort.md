---
title: "Topological Sort"
description: "Xếp các đỉnh của một đồ thị có hướng thành một hàng sao cho mọi cạnh đều chỉ về phía sau."
tags: [algorithms, graph, topological-sort]
type: note
region: Vùng Thuật toán
---

**Thứ tự topo** là một cách xếp các đỉnh thành hàng sao cho với mọi cạnh `u → v`, `u` đứng trước `v`. Nó tồn tại khi và chỉ khi đồ thị là một [[concepts/directed-acyclic-graph|DAG]], và thường không duy nhất: hai việc không phụ thuộc nhau đổi chỗ cho nhau vẫn đúng.

Có hai cách tìm, cả hai O(V + E): thuật toán Kahn lấy dần các đỉnh có [[concepts/in-degree|bậc vào]] 0, còn DFS lấy thứ tự hoàn thành đảo ngược (xem [[concepts/three-color-dfs|DFS ba màu]]).

Đọc thêm trong bài [[posts/2026-11-26-neetcode-topological-sort|ga 3: Sắp xếp topo]].
