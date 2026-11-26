---
title: "Reverse Reachability"
description: "Thay vì hỏi từng điểm có tới được đích không, xuất phát từ đích và đi ngược chiều cạnh để tìm mọi điểm tới được nó."
tags: [algorithms, graph, bfs]
type: note
region: Vùng Thuật toán
---

Câu hỏi "những đỉnh nào tới được đích?" có thể trả lời bằng một lượt duyệt cho mỗi đỉnh. **Đi ngược từ đích** trả lời nó bằng đúng một lượt: xuất phát từ đích, bước theo chiều ngược của cạnh. Đỉnh nào được ghi sổ thì có đường tới đích.

Trong bài nước chảy ra hai đại dương, nước chảy từ ô cao sang ô không cao hơn, nên đi ngược là bước sang ô **không thấp hơn**. Hai lượt [[concepts/multi-source-bfs|BFS đa nguồn]] từ hai bờ thay cho một lượt duyệt ở mỗi ô. Bài lật vùng bị bao kín dùng cùng ý: đích là mép bảng, và mọi ô đi được từ mép là ô an toàn.

Đọc thêm trong bài [[posts/2026-11-26-neetcode-graph-bfs|ga 2: Duyệt đồ thị và BFS]].
