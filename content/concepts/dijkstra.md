---
title: "Dijkstra"
description: "Chốt lần lượt các đỉnh có khoảng cách ngắn nhất đã biết khi trọng số cạnh không âm."
tags: [algorithms, graph, shortest-path]
type: note
region: Vùng Thuật toán
---

**Dijkstra** giữ một chi phí tạm cho mỗi đỉnh và lấy bản ghi nhỏ nhất đang chờ. Với trọng số không âm, cạnh đầu tiên đi từ phần đã chốt sang phần chưa chốt trên bất kỳ đường tốt hơn nào sẽ tạo một bản ghi nhỏ hơn, nên lần lấy hợp lệ chốt được khoảng cách. Khi heap chứa cả bản cũ, so lại với sổ khoảng cách trước khi xét các cạnh đi ra.

Đọc thêm trong bài [[posts/2026-11-27-neetcode-shortest-path|ga 5: Đường đi ngắn nhất]].
