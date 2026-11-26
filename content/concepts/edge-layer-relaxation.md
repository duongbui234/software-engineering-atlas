---
title: "Relaxation theo lớp cạnh"
description: "Tách mỗi lượt cập nhật chi phí theo một ngân sách cạnh để giới hạn đúng số bước."
tags: [algorithms, graph, shortest-path]
type: note
region: Vùng Thuật toán
---

**Relaxation theo lớp cạnh** ghi chi phí nhỏ nhất tới mỗi đỉnh với tối đa `i` cạnh. Mỗi lượt khởi đầu bằng bản sao lớp `i−1` để giữ đường ngắn hơn về số cạnh, rồi chỉ đọc chi phí nguồn từ bản cũ khi thử nối một cạnh. Việc ghi đè ngay vào bản đang đọc có thể nối nhiều cạnh trong cùng lượt.

Đọc thêm trong bài [[posts/2026-11-27-neetcode-shortest-path|ga 5: Đường đi ngắn nhất]].
