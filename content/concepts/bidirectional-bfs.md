---
title: "Bidirectional BFS"
description: "Chạy BFS cùng lúc từ điểm đầu và điểm đích, mở rộng từng lớp của phía nhỏ hơn, dừng khi hai phía gặp nhau."
tags: [algorithms, graph, bfs]
type: note
region: Vùng Thuật toán
---

**BFS hai đầu** giữ hai tập: các đỉnh đã tới từ điểm đầu và các đỉnh đã tới từ điểm đích. Mỗi vòng, mình mở rộng **trọn một lớp** của tập nhỏ hơn. Khi một đỉnh vừa sinh ra đã thuộc tập bên kia, độ dài đường đi là tổng số lớp hai phía đã đi.

Nếu mỗi đỉnh có khoảng b hàng xóm và đường ngắn nhất dài d, một phía phải chạm cỡ b^d đỉnh, còn hai phía chỉ cỡ 2·b^(d/2). Cần biết trước đỉnh đích, và cạnh phải đi được theo cả hai chiều (hoặc biết cách đi ngược). Trong phép đo Word Ladder của mình, cách này lấy ra 102 từ thay vì 4 293.

Đọc thêm trong bài [[posts/2026-11-26-neetcode-graph-bfs|ga 2: Duyệt đồ thị và BFS]].
