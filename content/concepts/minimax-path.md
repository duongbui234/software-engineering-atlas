---
title: "Đường đi minimax"
description: "Chọn đường có giá trị lớn nhất dọc đường nhỏ nhất trong mọi đường hợp lệ."
tags: [algorithms, graph, shortest-path]
type: note
region: Vùng Thuật toán
---

**Đường đi minimax** đo một tuyến bằng phần tử lớn nhất trên tuyến. Trong lưới nước dâng, cần chờ độ cao lớn nhất của các ô trên đường, gồm cả điểm xuất phát. Kéo thêm một ô chỉ giữ nguyên hoặc tăng giá trị `max`, nên có thể dùng vòng lặp [[concepts/dijkstra|Dijkstra]] với quy tắc cập nhật phù hợp.

Đọc thêm trong bài [[posts/2026-11-27-neetcode-shortest-path|ga 5: Đường đi ngắn nhất]].
