---
title: "Multi-source BFS"
description: "Cho mọi nguồn vào hàng đợi ở khoảng cách 0 để một lượt BFS tìm khoảng cách tới nguồn gần nhất."
tags: [algorithms, graph, bfs]
type: note
region: Vùng Thuật toán
---

Trong **BFS đa nguồn**, mình xếp tất cả nguồn trước khi xử lý ô đầu tiên. Trên đồ thị có chi phí mỗi cạnh bằng một, hàng đợi duyệt khoảng cách tăng dần. Một đỉnh được phát hiện lần đầu từ một nguồn gần nhất. Đỉnh không tới được giữ dấu chưa thăm.

Đọc thêm trong bài [[posts/2026-11-26-neetcode-grid-traversal|ga 1: Duyệt lưới]].
